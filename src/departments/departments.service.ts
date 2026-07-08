import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department) private readonly repo: Repository<Department>,
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
  ) {}

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const existing = await this.repo.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Department name must be unique');
    const dep = this.repo.create(dto);
    return this.repo.save(dep);
  }

  findAll(): Promise<Department[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Department> {
    const dep = await this.repo.findOne({ where: { id } });
    if (!dep) throw new NotFoundException('Department not found');
    return dep;
  }

  async update(id: number, dto: UpdateDepartmentDto): Promise<Department> {
    const dep = await this.findOne(id);
    if (dto.name && dto.name !== dep.name) {
      const existing = await this.repo.findOne({ where: { name: dto.name } });
      if (existing) throw new ConflictException('Department name must be unique');
    }
    Object.assign(dep, dto);
    return this.repo.save(dep);
  }

  async remove(id: number): Promise<void> {
    const dep = await this.findOne(id);
    const count = await this.employeeRepo.count({ where: { department: { id } } });
    if (count > 0) throw new ConflictException('Cannot delete department with employees');
    await this.repo.remove(dep);
  }
}
