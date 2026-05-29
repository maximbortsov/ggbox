import { Expose } from 'class-transformer'
import { IsString, MaxLength, MinLength } from 'class-validator'


export class CreateTagDto {

    @Expose()
    @IsString()
    @MinLength(2)
    @MaxLength(64)
    name: string

}
