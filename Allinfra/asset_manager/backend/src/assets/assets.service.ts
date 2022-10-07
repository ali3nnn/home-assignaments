import * as mongodb from "mongodb";
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Assets } from './entities/asset.entity';

@Injectable()
export class AssetsService {

  constructor(
    @InjectRepository(Assets)
    private assetsRepository: Repository<Assets>,
  ) { }

  async create(createAssetDto: CreateAssetDto) {
    const asset = this.assetsRepository.create(createAssetDto)
    const result = await this.assetsRepository.save(asset);
    return result;
  }

  async findOne(_id: string) {
    const result = await this.assetsRepository.findOneBy({ _id: new mongodb.ObjectID(_id) });
    if (!result) {
      throw new NotFoundException('Asset not found.')
    }
    return result
  }

  async findAll() {
    const result = await this.assetsRepository.find();
    if(!result.length) {
      throw new NotFoundException('Assets not found.')
    }
    return result;
  }

  async update(id: string, updateAssetDto: UpdateAssetDto) {
    await this.findOne(id)
    const result = await this.assetsRepository.update(id, updateAssetDto);
    const item = await this.findOne(id)
    return {
      result,
      item
    }
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.assetsRepository.delete(id);
  }
}
