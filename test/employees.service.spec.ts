import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../src/departments/department.entity';
import { Employee } from '../src/employees/employee.entity';
import { EmployeesService } from '../src/employees/employees.service';
import { Role } from '../src/roles/role.entity';

function createRepoMock<T>() {
  return {
    findOne: jest.fn(),
    create: jest.fn((x) => x),
    save: jest.fn((x) => x),
    findAndCount: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<Repository<T>>;
}

describe('EmployeesService', () => {
  let service: EmployeesService;
  let repo: jest.Mocked<Repository<Employee>>;
  let depRepo: jest.Mocked<Repository<Department>>;
  let roleRepo: jest.Mocked<Repository<Role>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: getRepositoryToken(Employee), useValue: createRepoMock<Employee>() },
        { provide: getRepositoryToken(Department), useValue: createRepoMock<Department>() },
        { provide: getRepositoryToken(Role), useValue: createRepoMock<Role>() },
      ],
    }).compile();

    service = module.get(EmployeesService);
    repo = module.get(getRepositoryToken(Employee));
    depRepo = module.get(getRepositoryToken(Department));
    roleRepo = module.get(getRepositoryToken(Role));
  });

  it('creates employee and prevents duplicate email', async () => {
    repo.findOne.mockResolvedValueOnce(null as any);
    depRepo.findOne.mockResolvedValueOnce({ id: 1, name: 'HR' } as Department);
    roleRepo.findOne.mockResolvedValueOnce({ id: 1, name: 'Dev' } as Role);
    repo.save.mockImplementation(async (x) => ({ id: 1, ...(x as any) }));

    const emp = await service.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      departmentId: 1,
      roleId: 1,
      dateOfJoining: new Date().toISOString(),
    });
    expect(emp.id).toBe(1);

    repo.findOne.mockResolvedValueOnce({ id: 2, email: 'john@example.com' } as Employee);
    await expect(
      service.create({ firstName: 'A', lastName: 'B', email: 'john@example.com', departmentId: 1, roleId: 1, dateOfJoining: new Date().toISOString() }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('updates employee fields and relations', async () => {
    repo.findOne.mockResolvedValueOnce({ id: 1, email: 'a@b.com' } as Employee);
    repo.findOne.mockResolvedValueOnce(null as any); // email uniqueness check
    depRepo.findOne.mockResolvedValueOnce({ id: 2, name: 'Ops' } as Department);
    roleRepo.findOne.mockResolvedValueOnce({ id: 3, name: 'QA' } as Role);
    repo.save.mockImplementation(async (x) => x as any);

    const updated = await service.update(1, {
      email: 'new@b.com',
      departmentId: 2,
      roleId: 3,
      firstName: 'New',
      lastName: 'Name',
    });
    expect(updated.email).toBe('new@b.com');
  });

  it('throws not found on missing related entities', async () => {
    repo.findOne.mockResolvedValueOnce(null as any);
    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
  });
});
