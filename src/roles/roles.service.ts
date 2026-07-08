import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly repo: Repository<Role>,
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const existing = await this.repo.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Role name must be unique');
    const role = this.repo.create(dto);
    return this.repo.save(role);
  }

  findAll(): Promise<Role[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: number, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    if (dto.name && dto.name !== role.name) {
      const existing = await this.repo.findOne({ where: { name: dto.name } });
      if (existing) throw new ConflictException('Role name must be unique');
    }
    Object.assign(role, dto);
    return this.repo.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    const count = await this.employeeRepo.count({ where: { role: { id } } });
    if (count > 0) throw new ConflictException('Cannot delete role with employees');
    await this.repo.remove(role);
  }
}
