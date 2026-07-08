import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Department } from '../departments/department.entity';
import { Role } from '../roles/role.entity';
import { EmployeeStatus } from './employee-status.enum';

@Entity()
@Unique(['email'])
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Department, (d) => d.employees, { eager: true, nullable: false })
  department: Department;

  @ManyToOne(() => Role, (r) => r.employees, { eager: true, nullable: false })
  role: Role;

  @Column({ type: 'text', default: EmployeeStatus.ACTIVE })
  status: EmployeeStatus;

  @Column({ type: 'datetime' })
  dateOfJoining: Date;
}
