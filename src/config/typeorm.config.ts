import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Department } from '../departments/department.entity';
import { Role } from '../roles/role.entity';
import { Employee } from '../employees/employee.entity';

export function typeOrmConfig(): TypeOrmModuleOptions {
  const isTest = process.env.JEST_WORKER_ID !== undefined || process.env.NODE_ENV === 'test';
  const dbType = (process.env.DB_TYPE || 'sqlite') as 'sqlite' | 'postgres';

  if (isTest) {
    return {
      type: 'sqlite',
      database: ':memory:',
      entities: [Department, Role, Employee],
      synchronize: true,
    } as TypeOrmModuleOptions;
  }

  if (dbType === 'postgres') {
    // Placeholder for future Postgres usage and migrations
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'app',
      autoLoadEntities: true,
      synchronize: true,
    } as TypeOrmModuleOptions;
  }

  // Default SQLite file for local/dev
  return {
    type: 'sqlite',
    database: process.env.SQLITE_DATABASE || 'dev.sqlite',
    entities: [Department, Role, Employee],
    synchronize: true,
  } as TypeOrmModuleOptions;
}
