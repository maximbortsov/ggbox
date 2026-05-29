import { ClassConstructor, Expose, plainToInstance, Transform, TransformationType } from 'class-transformer'
import { isJSON, IsOptional, ValidateNested } from 'class-validator'
import { BadRequestException, Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { ApiFile } from '../decorators/swagger/api-file.decorator'


export interface NullableFileDto<T> {
    data: T
    file?: Express.Multer.File | null
}


export interface NullableFileParams {
    fileDesc?: string
}


/**
 * @description Create DTO with optional & nullable (null || undefined) file
 */
export function WithNullableFileDto<T>(cls: ClassConstructor<T>, params?: NullableFileParams): Type<NullableFileDto<T>> {

    class Class implements NullableFileDto<T> {

        @Expose()
        @Transform(
            ({ value, type }) => {
                switch (type) {
                    case TransformationType.PLAIN_TO_CLASS:
                        if (!isJSON(value)) {
                            throw new BadRequestException(['data must be a json'])
                        }
                        return plainToInstance(cls, JSON.parse(value))
                    case TransformationType.CLASS_TO_PLAIN:
                        return JSON.stringify(value)
                    default:
                        return value
                }
            },
        )
        @ValidateNested()
        @ApiProperty({
            type: () => cls,
            description: `Schema<br><b>${cls.name}</b>`,
        })
        data: T

        @Expose()
        @Transform(({ value }) => value === '' ? null : value)
        @IsOptional()
        @ApiFile({
            required: false,
            nullable: true,
            description: `${params?.fileDesc ?? 'File upload field'}<br><i>Use an empty string to set field to null</i>`,
        })
        file?: Express.Multer.File | null
    }


    return Class
}
