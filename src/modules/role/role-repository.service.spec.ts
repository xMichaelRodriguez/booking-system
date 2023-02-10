import { Test, TestingModule } from '@nestjs/testing';

import { RoleRepositoryService } from './role-repository.service';

describe('RoleRepositoryService', () => {
  let service: RoleRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleRepositoryService],
    }).compile();

    service = module.get<RoleRepositoryService>(RoleRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
