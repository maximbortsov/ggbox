import { IsEnum, IsOptional } from 'class-validator'
import { ToStringArray } from '../../../shared/decorators/transformer/to-string-array.decorator'
import { Expose } from 'class-transformer'
import { EditionFindOneInclude } from './edition.include'


export class EditionFindOneArgs {

    @Expose()
    @ToStringArray()
    @IsOptional()
    @IsEnum(EditionFindOneInclude, { each: true })
    include?: EditionFindOneInclude[]
}
