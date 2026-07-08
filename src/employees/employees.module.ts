import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Department } from '../departments/department.entity';
import { Role } from '../roles/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Department, Role])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
