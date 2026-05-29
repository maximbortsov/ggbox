import { IsString, MinLength } from 'class-validator'
import { Expose } from 'class-transformer'


export class ChangePasswordDto {

    @Expose()
    @IsString()
    @MinLength(4)
    password: string
}
