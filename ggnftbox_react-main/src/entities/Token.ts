import { IsJWT, IsNotEmpty } from 'class-validator'


export class Token {
    @IsNotEmpty()
    @IsJWT()
    accessToken: string

    @IsNotEmpty()
    @IsJWT()
    refreshToken: string
}