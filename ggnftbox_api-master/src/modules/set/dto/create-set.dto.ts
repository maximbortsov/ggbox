import { IsString, MaxLength, MinLength } from 'class-validator'
import { Expose } from 'class-transformer'


export class CreateSetDto {

    @Expose()
    @IsString()
    @MinLength(6)
    @MaxLength(256)
    name: string

}
