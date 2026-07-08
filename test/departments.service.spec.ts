import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../src/departments/department.entity';
import { DepartmentsService } from '../src/departments/departments.service';
import { Employee } from '../src/employees/employee.entity';

function createRepoMock<T>() {
  return {
    findOne: jest.fn(),
    create: jest.fn((x) => x),
    save: jest.fn((x) => x),
    find: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  } as unknown as jest.Mocked<Repository<T>>;
}

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let repo: jest.Mocked<Repository<Department>>;
  let empRepo: jest.Mocked<Repository<Employee>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        { provide: getRepositoryToken(Department), useValue: createRepoMock<Department>() },
        { provide: getRepositoryToken(Employee), useValue: createRepoMock<Employee>() },
      ],
    }).compile();

    service = module.get(DepartmentsService);
    repo = module.get(getRepositoryToken(Department));
    empRepo = module.get(getRepositoryToken(Employee));
  });

  it('creates department and prevents duplicates', async () => {
    repo.findOne.mockResolvedValueOnce(null as any);
    repo.save.mockResolvedValueOnce({ id: 1, name: 'HR' } as Department);
    const created = await service.create({ name: 'HR' });
    expect(created.name).toBe('HR');

    repo.findOne.mockResolvedValueOnce({ id: 2, name: 'HR' } as Department);
    await expect(service.create({ name: 'HR' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('updates department and checks unique name', async () => {
    repo.findOne.mockImplementation(async ({ where }: any) => {
      if (where.id === 1) return { id: 1, name: 'HR' } as Department;
      if (where.name === 'Existing') return { id: 2, name: 'Existing' } as Department;
      return null as any;
    });
    repo.save.mockImplementation(async (x) => x as any);

    const updated = await service.update(1, { name: 'New' });
    expect(updated.name).toBe('New');

    await expect(service.update(1, { name: 'Existing' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('prevents delete when employees exist', async () => {
    repo.findOne.mockResolvedValueOnce({ id: 1, name: 'HR' } as Department);
    empRepo.count.mockResolvedValueOnce(1 as any);
    await expect(service.remove(1)).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws not found', async () => {
    repo.findOne.mockResolvedValueOnce(null as any);
    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
  });
});
