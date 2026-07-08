import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { EmployeeStatus } from '../employee-status.enum';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsInt()
  @IsOptional()
  departmentId?: number;

  @IsInt()
  @IsOptional()
  roleId?: number;

  @IsEnum(EmployeeStatus)
  @IsOptional()
  status?: EmployeeStatus;

  @IsDateString()
  @IsOptional()
  dateOfJoining?: string;
}
