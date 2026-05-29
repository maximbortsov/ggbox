import { ClassConstructor, Expose, plainToInstance, Transform, TransformationType } from 'class-transformer'
import { IsDefined, isJSON, ValidateNested } from 'class-validator'
import { BadRequestException, Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { ApiFile } from '../decorators/swagger/api-file.decorator'


export interface RequiredFileDto<T> {
    data: T
    file: Express.Multer.File
}


export interface RequiredFileParams {
    fileDesc?: string
}


/**
 * @description Create DTO with required file
 */
export function WithFileDto<T>(cls: ClassConstructor<T>, params?: RequiredFileParams): Type<RequiredFileDto<T>> {

    class Class implements RequiredFileDto<T> {

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
        @Transform(({ value }) => value === '' ? undefined : value)
        @IsDefined()
        @ApiFile({
            description: `${params?.fileDesc ?? 'File upload field'}`,
        })
        file: Express.Multer.File
    }


    return Class
}
