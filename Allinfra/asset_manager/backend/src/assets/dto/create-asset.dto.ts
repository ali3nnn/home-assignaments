import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAssetDto {

  @ApiProperty({
    default: "12345678990"
  })
  @IsString()
  @IsNotEmpty()
  serial: string;

  @ApiProperty({
    default: "temperature"
  })
  @IsString()
  type: string;

  @ApiProperty({
    default: "white"
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    default: {
      "key": "value"
    }
  })
  @IsObject()
  @IsNotEmptyObject()
  metadata: object;

}
