import { BoxInclude } from './box.include'
import { IsEnum, IsOptional } from 'class-validator'
import { ToStringArray } from '../../../shared/decorators/transformer/to-string-array.decorator'
import { Expose } from 'class-transformer'


export class BoxFindOneArgs {

    @Expose()
    @ToStringArray()
    @IsOptional()
    @IsEnum(BoxInclude, { each: true })
    include?: BoxInclude[]
}
