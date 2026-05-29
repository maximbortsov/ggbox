import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator'
import { IncompatibleWith } from '../../../shared/decorators/validation/incompatible-with.decorator'
import { Expose } from 'class-transformer'


export class ConnectSetDto {

    @Expose()
    @IncompatibleWith(['name', 'flowId'])
    @IsUUID('4')
    id?: string

    @Expose()
    @IncompatibleWith(['id', 'flowId'])
    @IsString()
    @MinLength(6)
    @MaxLength(256)
    name?: string

    @Expose()
    @IncompatibleWith(['id', 'name'])
    @IsString()
    @MaxLength(20)
    flowId?: string
}
