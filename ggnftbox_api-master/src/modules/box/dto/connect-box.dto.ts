import { IsUUID } from 'class-validator'


export class ConnectBoxDto {

    @IsUUID('4')
    id: string
}
