import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, HttpCode, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiHeader, ApiTags, ApiResponse, ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetNotFound, FindOneResponse, UpdateResponse, DeleteResponse, ServerErrorResponse, FindAllResponse, CreateResponse, BadRequestResponse } from './schemas/assets.schemas';

@ApiTags('Assets Controller')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new asset into the database' })
  @ApiCreatedResponse({
    type: CreateResponse,
    isArray: true
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    isArray: false
  })
  @ApiInternalServerErrorResponse({
    type: ServerErrorResponse
  })
  async create(@Body() createAssetDto: CreateAssetDto) {
    const asset = await this.assetsService.create(createAssetDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: "Asset added successfully",
      result: [asset]
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all assets from the database' })
  @ApiOkResponse({
    type: FindAllResponse,
    isArray: true
  })
  @ApiNotFoundResponse({
    type: AssetNotFound,
    isArray: false
  })
  @ApiInternalServerErrorResponse({
    type: ServerErrorResponse
  })
  async findAll() {
    const result = await this.assetsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: "Assets retrieved successfully",
      result
    }

  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get one asset from the database by ID' })
  @ApiOkResponse({
    type: FindOneResponse,
    isArray: true
  })
  @ApiNotFoundResponse({
    type: AssetNotFound,
    isArray: false
  })
  @ApiInternalServerErrorResponse({
    type: ServerErrorResponse
  })
  async findOne(
    @Param('id')
    id: string
  ) {
    const result = await this.assetsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: `Asset retrieved successfully!`,
      result: [result]
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update asset properties by ID' })
  @ApiCreatedResponse({
    type: UpdateResponse,
    isArray: true
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    isArray: false
  })
  @ApiNotFoundResponse({
    type: AssetNotFound,
    isArray: false
  })
  @ApiInternalServerErrorResponse({
    type: ServerErrorResponse
  })
  async update(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto
  ) {
    console.log(updateAssetDto)
    const { item } = await this.assetsService.update(id, updateAssetDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: `${id} updated successfully!`,
      result: [item]
    }

  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove asset by ID' })
  @ApiOkResponse({
    type: DeleteResponse,
    isArray: false
  })
  @ApiNotFoundResponse({
    type: AssetNotFound,
    isArray: true
  })
  @ApiInternalServerErrorResponse({
    type: ServerErrorResponse
  })
  async remove(
    @Param('id')
    id: string
  ) {
    await this.assetsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: `${id} removed successfully!`,
    }
  }
}

