import { Transform } from 'class-transformer'
import { IsDefined } from 'class-validator'
import { ApiFile } from '../../../shared/decorators/swagger/api-file.decorator'


export class UpdateBoxVideoDto {

    @Transform(({ value }) => value === '' ? undefined : value)
    @IsDefined()
    @ApiFile({
        description: 'File upload field',
    })
    file: Express.Multer.File
}
