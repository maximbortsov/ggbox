import { BoxTokenInclude } from './box-token.include'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { ToStringArray } from '../../../shared/decorators/transformer/to-string-array.decorator'
import { Expose } from 'class-transformer'
import { ToBoolean } from '../../../shared/decorators/transformer/to-boolean.decorator'


export class BoxTokenFindAllArgs {

    /**
     * Entities to include in the response
     */
    @Expose()
    @ToStringArray()
    @IsOptional()
    @IsEnum(BoxTokenInclude, { each: true })
    include?: BoxTokenInclude[]

    /**
     * BoxToken is open if NFTs has already been received from it
     */
    @Expose()
    @ToBoolean()
    @IsOptional()
    @IsBoolean()
    open?: boolean

}
