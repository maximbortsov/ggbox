import { IsUUID } from 'class-validator'
import { Expose } from 'class-transformer'


export class ConnectLotDto {

    @Expose()
    @IsUUID('4')
    id: string
}
