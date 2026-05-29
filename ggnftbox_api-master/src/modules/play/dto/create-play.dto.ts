import { CreatePlayDataDto } from './create-play-data.dto'
import { Expose, plainToInstance, Transform, TransformationType } from 'class-transformer'
import { IsDefined, isJSON, ValidateNested } from 'class-validator'
import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { ApiFile } from '../../../shared/decorators/swagger/api-file.decorator'


export class CreatePlayDto {

    /**
     * DATA PART
     */
    @Expose()
    @Transform(
        ({ value, type }) => {
            switch (type) {
                case TransformationType.PLAIN_TO_CLASS:
                    if (!isJSON(value)) {
                        throw new BadRequestException(['data must be a json'])
                    }
                    return plainToInstance(CreatePlayDataDto, JSON.parse(value))
                case TransformationType.CLASS_TO_PLAIN:
                    return JSON.stringify(value)
                default:
                    return value
            }
        },
    )
    @ValidateNested()
    @ApiProperty({
        type: () => CreatePlayDataDto,
        description: `Schema<br><b>${CreatePlayDataDto.name}</b>`,
    })
    data: CreatePlayDataDto

    /**
     * VIDEO PART
     */
    @Expose()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsDefined()
    @ApiFile({
        description: 'Video file (.mp4) upload field',
    })
    video: Express.Multer.File

}
