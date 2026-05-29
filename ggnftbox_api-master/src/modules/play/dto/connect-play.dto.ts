import { IsString, IsUUID, MaxLength } from 'class-validator'
import { IncompatibleWith } from '../../../shared/decorators/validation/incompatible-with.decorator'
import { Expose } from 'class-transformer'


export class ConnectPlayDto {

    @Expose()
    @IncompatibleWith(['flowId'])
    @IsUUID('4')
    id?: string

    @Expose()
    @IncompatibleWith(['id'])
    @IsString()
    @MaxLength(20)
    flowId?: string
}
