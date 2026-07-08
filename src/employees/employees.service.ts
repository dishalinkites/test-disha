import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Department } from '../departments/department.entity';
import { Role } from '../roles/role.entity';
import { EmployeeStatus } from './employee-status.enum';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private readonly repo: Repository<Employee>,
    @InjectRepository(Department) private readonly depRepo: Repository<Department>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email must be unique');

    const department = await this.depRepo.findOne({ where: { id: dto.departmentId } });
    if (!department) throw new NotFoundException('Department not found');

    const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException('Role not found');

    const emp = this.repo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      department,
      role,
      status: dto.status || EmployeeStatus.ACTIVE,
      dateOfJoining: new Date(dto.dateOfJoining),
    });
    return this.repo.save(emp);
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    departmentId?: number;
    roleId?: number;
    status?: EmployeeStatus;
  }): Promise<{ data: Employee[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));

    const where: FindOptionsWhere<Employee> = {};
    if (params.departmentId) (where as any).department = { id: params.departmentId } as any;
    if (params.roleId) (where as any).role = { id: params.roleId } as any;
    if (params.status) where.status = params.status;

    const [data, total] = await this.repo.findAndCount({ where, skip: (page - 1) * limit, take: limit, order: { id: 'ASC' } });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Employee> {
    const emp = await this.repo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException('Employee not found');
    return emp;
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const emp = await this.findOne(id);

    if (dto.email && dto.email !== emp.email) {
      const existing = await this.repo.findOne({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Email must be unique');
      emp.email = dto.email;
    }

    if (dto.departmentId) {
      const department = await this.depRepo.findOne({ where: { id: dto.departmentId } });
      if (!department) throw new NotFoundException('Department not found');
      emp.department = department;
    }

    if (dto.roleId) {
      const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });
      if (!role) throw new NotFoundException('Role not found');
      emp.role = role;
    }

    if (dto.firstName !== undefined) emp.firstName = dto.firstName;
    if (dto.lastName !== undefined) emp.lastName = dto.lastName;
    if (dto.status !== undefined) emp.status = dto.status;
    if (dto.dateOfJoining !== undefined) emp.dateOfJoining = new Date(dto.dateOfJoining);

    return this.repo.save(emp);
  }

  async remove(id: number): Promise<void> {
    const emp = await this.findOne(id);
    await this.repo.remove(emp);
  }
}
