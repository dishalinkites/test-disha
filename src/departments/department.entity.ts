import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Employee } from '../employees/employee.entity';

@Entity()
@Unique(['name'])
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Employee, (e) => e.department)
  employees: Employee[];
}
