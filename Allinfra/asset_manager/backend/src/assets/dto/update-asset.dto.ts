import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { CreateAssetDto } from './create-asset.dto';

export class UpdateAssetDto extends PartialType(CreateAssetDto) {

    @ApiProperty({
        required: false,
        default: "12345678990"
    })
    @IsOptional()
    @IsString()
    serial: string;

    @ApiProperty({
        required: false,
        default: "temperature"
    })
    @IsOptional()
    @IsString()
    type: string;

    @ApiProperty({
        required: false,
        default: "white"
    })
    @IsOptional()
    @IsString()
    color: string;

    @ApiProperty({
        required: false,
        default: {
            "key": "value"
        }
    })
    @IsOptional()
    @IsObject()
    metadata: object;
}
