import { IsEnum, IsOptional } from 'class-validator'
import { ToStringArray } from '../../../shared/decorators/transformer/to-string-array.decorator'
import { LotInclude } from './lot.include'
import { Expose } from 'class-transformer'


export class LotFindOneArgs {

    @Expose()
    @ToStringArray()
    @IsOptional()
    @IsEnum(LotInclude, { each: true })
    include?: LotInclude[]
}
