import { IncompatibleWith } from '../../../shared/decorators/validation/incompatible-with.decorator'
import { Expose } from 'class-transformer'
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator'


export class ConnectStreamerDto {

    @Expose()
    @IncompatibleWith(['name'])
    @IsUUID('4')
    id?: string

    @Expose()
    @IncompatibleWith(['id'])
    @IsString()
    @MinLength(2)
    @MaxLength(128)
    name?: string
}
