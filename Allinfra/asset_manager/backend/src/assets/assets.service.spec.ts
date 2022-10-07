import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetsService } from './assets.service';
import { Assets } from './entities/asset.entity';

// @ts-ignore
const repositoryMockFactory: () => AssetsService<Repository<any>> = jest.fn(() => ({
  findAll: jest.fn(entity => [entity]),
}));

describe('AssetsService', () => {
  let service: AssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetsService, { provide: getRepositoryToken(Assets), useFactory: repositoryMockFactory }],
    }).compile();

    service = module.get<AssetsService>(AssetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
});
