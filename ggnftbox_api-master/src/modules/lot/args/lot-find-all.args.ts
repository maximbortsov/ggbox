import { IsBoolean, IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator'
import { ToStringArray } from '../../../shared/decorators/transformer/to-string-array.decorator'
import { LotInclude } from './lot.include'
import { ToBoolean } from '../../../shared/decorators/transformer/to-boolean.decorator'
import { ToNumber } from '../../../shared/decorators/transformer/to-number.decorator'
import { Expose } from 'class-transformer'


export class LotFindAllArgs {

    /**
     * Entities to include in the response
     */
    @Expose()
    @ToStringArray()
    @IsOptional()
    @IsEnum(LotInclude, { each: true })
    include?: LotInclude[]

    /**
     * ID of the Play that the lots belong to
     */
    @Expose()
    @IsOptional()
    @IsUUID('4')
    playId?: string

    /**
     * ID of the user who owns the nft and sells it
     */
    @Expose()
    @IsOptional()
    @IsUUID('4')
    ownerId?: string

    /**
     * Lot is open if it has no buyers
     */
    @Expose()
    @ToBoolean()
    @IsOptional()
    @IsBoolean()
    open?: boolean

    /**
     * Number of skipped entries
     */
    @Expose()
    @ToNumber()
    @IsOptional()
    @IsInt()
    @Min(0)
    skip?: number

    /**
     * Number of included entries
     */
    @Expose()
    @ToNumber()
    @IsOptional()
    @IsInt()
    @Min(1)
    take?: number
}
