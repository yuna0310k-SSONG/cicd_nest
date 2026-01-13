import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import * as fc from 'fast-check';

describe('StudentsService', () => {
  let service: StudentsService;
  let mockRepo: {
    create: jest.Mock;
    save: jest.Mock;
  };

  //테스트하기 전의 세팅 작업
  beforeEach(async () => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        //StudentsService 주입
        StudentsService,
        //student 엔티티의 래포지토리를 mockRepo로 주입
        {
          provide: getRepositoryToken(Student),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });
  it('학생 생성 테스트', async () => {
    const createDto = {
      name: '유나',
      email: 'yuna@example.com',
      age: 20,
    };
    //create함수가 실행되면, createDto를 반환
    mockRepo.create.mockReturnValue(createDto);
    //save함수가 실행되면, promise 성공 케이스 돌려줌
    mockRepo.save.mockResolvedValue({ ...createDto, id: 1, isActive: true });

    const result = await service.create(createDto);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('isActive');
    expect(result.name).toBe(createDto.name);
    expect(result.email).toBe(createDto.email);
    expect(result.age).toBe(createDto.age);
    expect(mockRepo.create).toHaveBeenCalledWith(createDto);
    expect(mockRepo.save).toHaveBeenCalledWith(createDto);
  });
  it('학생 생성 테스트 - 패스트 체크 버전', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          email: fc.emailAddress(),
          age: fc.integer({ min: 1, max: 100 }),
        }),
        async (dto) => {
          //create함수가 실행되면, createDto를 돌려주도록 설정
          mockRepo.create.mockReturnValue(dto);
          //save함수가 실행되면, promise 성공 케이스 돌려줌
          mockRepo.save.mockResolvedValue({
            ...dto,
            id: 1,
            isActive: true,
          });

          console.log({ dto });
          const result = await service.create(dto);

          expect(result).toHaveProperty('id');
          expect(result).toHaveProperty('isActive');
          expect(result.name).toBe(dto.name);
          expect(result.email).toBe(dto.email);
          expect(result.age).toBe(dto.age);
          expect(mockRepo.create).toHaveBeenCalledWith(dto);
        },
      ),
    );
  });
});
