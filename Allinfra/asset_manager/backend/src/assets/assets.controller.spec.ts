import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { Assets } from './entities/asset.entity';

// @ts-ignore
const repositoryMockFactory: () => AssetsService<Repository<any>> = jest.fn(() => ({
  findAll: jest.fn(entity => [entity]),
}));

describe('AssetsController', () => {
  let controller: AssetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [AssetsService, { provide: getRepositoryToken(Assets), useFactory: repositoryMockFactory }],
    }).compile();

    controller = module.get<AssetsController>(AssetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
