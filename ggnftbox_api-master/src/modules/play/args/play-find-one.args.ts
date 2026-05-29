import { IsEnum, IsOptional } from 'class-validator'
import { ToStringArray } from '../../../shared/decorators/transformer/to-string-array.decorator'
import { PlayFindOneInclude } from './play.include'
import { Expose } from 'class-transformer'


export class PlayFindOneArgs {

    @Expose()
    @ToStringArray()
    @IsOptional()
    @IsEnum(PlayFindOneInclude, { each: true })
    include?: PlayFindOneInclude[]
}
