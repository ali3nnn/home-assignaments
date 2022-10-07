import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString } from 'class-validator';

export class AssetNotFound {
    @ApiProperty({
        default: HttpStatus.NOT_FOUND
    })
    statusCode: number;

    @ApiProperty({
        default: "Asset not found"
    })
    message: string;

    @ApiProperty({
        default: "Not found"
    })
    error: string;
}

export class CreateResponse {

    @ApiProperty({
        required: false,
        default: "625da424cf7c6d3b245081af"
    })
    @IsString()
    @IsOptional()
    _id: string;

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

export class FindOneResponse {
    @ApiProperty({
        default: HttpStatus.OK
    })
    statusCode: number;

    @ApiProperty({
        default: "Asset retrieved successfully!"
    })
    message: string;

    @ApiProperty({
        default: [{
            "_id": "625da424cf7c6d3b245081af",
            "serial": "string",
            "type": "string",
            "color": "string",
            "metadata": {
                "key": "value"
            }
        }]
    })
    result: object;
}

export class FindAllResponse extends FindOneResponse {

    @ApiProperty({
        default: "Assets not found"
    })
    message: string;

    @ApiProperty({
        default: [{
            "_id": "625da424cf7c6d3b245081af",
            "serial": "string",
            "type": "string",
            "color": "string",
            "metadata": {
                "key": "value"
            }
        },
        {
            "_id": "625da424cf7s453b245081af",
            "serial": "string",
            "type": "string",
            "color": "string",
            "metadata": {
                "key": "value"
            }
        }]
    })
    result: object;
}

export class UpdateResponse {
    @ApiProperty({
        default: HttpStatus.CREATED
    })
    statusCode: number;

    @ApiProperty({
        default: "625da424cf7c6d3b245081af updated successfully!"
    })
    message: string;

    @ApiProperty({
        default: [{
            "_id": "625da424cf7c6d3b245081af",
            "serial": "12345678990",
            "type": "temperature",
            "color": "white",
            "metadata": {
                "key": "value"
            }
        }]
    })
    result: object;
}

export class DeleteResponse {

    @ApiProperty({
        default: HttpStatus.OK
    })
    statusCode: number;

    @ApiProperty({
        default: "625da424cf7c6d3b245081af removed successfully!"
    })
    message: string;
}

export class ServerErrorResponse {

    @ApiProperty({
        default: HttpStatus.INTERNAL_SERVER_ERROR
    })
    statusCode: number;

    @ApiProperty({
        default: "Internal server error"
    })
    message: string;

}

export class BadRequestResponse {

    @ApiProperty({
        default: HttpStatus.BAD_REQUEST
    })
    statusCode: number;

    @ApiProperty({
        default: [
            "serial should not be empty",
            "serial must be a string",
            "type must be a string",
            "color should not be empty",
            "color must be a string",
            "metadata must be a non-empty object",
            "metadata must be an object"
        ]
    })
    message: Array<string> | string;

    @ApiProperty({
        default: "Bad Request"
    })
    error: string;

}