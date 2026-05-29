import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { Expose } from 'class-transformer'


export class UpdateGameDataDto {

    @Expose()
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(128)
    name?: string
}
