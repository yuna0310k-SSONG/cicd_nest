import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';

describe('StudentsController', () => {
  let controller: StudentsController;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockRepo,
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('학생 컨트롤러 findOne 테스트', () => {
    expect(controller.findOne('10')).toBe('student id: 10');
  });
});
