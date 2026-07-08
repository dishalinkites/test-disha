import { Test } from '@nestjs/testing';
import { DepartmentsController } from '../departments.controller';
import { DepartmentsService } from '../departments.service';


describe('DepartmentsController', () => {
  it('should be defined', async () => {
    const module = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [
        { provide: DepartmentsService, useValue: { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() } },
      ],
    }).compile();

    const ctrl = module.get(DepartmentsController);
    expect(ctrl).toBeDefined();
  });
});
