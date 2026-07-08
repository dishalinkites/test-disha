import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Department } from '../src/departments/department.entity';
import { Role } from '../src/roles/role.entity';
import { Employee } from '../src/employees/employee.entity';

// Boot app with in-memory SQLite

describe('App E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({ type: 'sqlite', database: ':memory:', entities: [Department, Role, Employee], synchronize: true }),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('happy path for departments, roles, employees', async () => {
    const depRes = await request(app.getHttpServer()).post('/departments').send({ name: 'HR' }).expect(201);
    const dep = depRes.body;

    const roleRes = await request(app.getHttpServer()).post('/roles').send({ name: 'Engineer' }).expect(201);
    const role = roleRes.body;

    const empRes = await request(app.getHttpServer())
      .post('/employees')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        departmentId: dep.id,
        roleId: role.id,
        status: 'ACTIVE',
        dateOfJoining: new Date().toISOString(),
      })
      .expect(201);
    const emp = empRes.body;
    expect(emp.id).toBeDefined();
    expect(emp.department.id).toBe(dep.id);
    expect(emp.role.id).toBe(role.id);

    await request(app.getHttpServer()).get('/employees').expect(200);

    await request(app.getHttpServer()).get(`/employees/${emp.id}`).expect(200);

    await request(app.getHttpServer()).patch(`/employees/${emp.id}`).send({ lastName: 'Smith' }).expect(200);

    await request(app.getHttpServer()).delete(`/employees/${emp.id}`).expect(200);
  });
});
