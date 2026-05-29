import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'


export class LoginDto {

    @IsEmail()
    @MaxLength(256)
    email: string

    @IsString()
    @MinLength(4)
    password: string
}
