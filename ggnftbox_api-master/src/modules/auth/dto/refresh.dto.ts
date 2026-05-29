import { IsJWT } from 'class-validator'
import { Expose } from 'class-transformer'


export class RefreshDto {

    @Expose()
    @IsJWT()
    refreshToken: string
}
