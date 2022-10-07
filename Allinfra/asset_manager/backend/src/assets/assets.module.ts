import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { Assets } from './entities/asset.entity';

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Assets])],
  controllers: [AssetsController],
  providers: [AssetsService]
})
export class AssetsModule { }
