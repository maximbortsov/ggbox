import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class RegisterDataDto {

    @IsEmail()
    @MaxLength(256)
    email: string

    @IsString()
    username: string

    @IsString()
    @MinLength(4)
    password: string
}
