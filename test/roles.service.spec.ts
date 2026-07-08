import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../src/employees/employee.entity';
import { Role } from '../src/roles/role.entity';
import { RolesService } from '../src/roles/roles.service';

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

describe('RolesService', () => {
  let service: RolesService;
  let repo: jest.Mocked<Repository<Role>>;
  let empRepo: jest.Mocked<Repository<Employee>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getRepositoryToken(Role), useValue: createRepoMock<Role>() },
        { provide: getRepositoryToken(Employee), useValue: createRepoMock<Employee>() },
      ],
    }).compile();

    service = module.get(RolesService);
    repo = module.get(getRepositoryToken(Role));
    empRepo = module.get(getRepositoryToken(Employee));
  });

  it('creates role and prevents duplicates', async () => {
    repo.findOne.mockResolvedValueOnce(null as any);
    repo.save.mockResolvedValueOnce({ id: 1, name: 'Dev' } as Role);
    const created = await service.create({ name: 'Dev' });
    expect(created.name).toBe('Dev');

    repo.findOne.mockResolvedValueOnce({ id: 2, name: 'Dev' } as Role);
    await expect(service.create({ name: 'Dev' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('updates and checks unique name', async () => {
    repo.findOne.mockImplementation(async ({ where }: any) => {
      if (where.id === 1) return { id: 1, name: 'Dev' } as Role;
      if (where.name === 'Existing') return { id: 2, name: 'Existing' } as Role;
      return null as any;
    });
    repo.save.mockImplementation(async (x) => x as any);

    const updated = await service.update(1, { name: 'New' });
    expect(updated.name).toBe('New');

    await expect(service.update(1, { name: 'Existing' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('prevents delete when employees exist', async () => {
    repo.findOne.mockResolvedValueOnce({ id: 1, name: 'Dev' } as Role);
    empRepo.count.mockResolvedValueOnce(1 as any);
    await expect(service.remove(1)).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws not found', async () => {
    repo.findOne.mockResolvedValueOnce(null as any);
    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
  });
});
