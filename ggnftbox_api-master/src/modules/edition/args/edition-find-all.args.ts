import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator'
import { EditionFindAllInclude } from './edition.include'
import { ToStringArray } from '../../../shared/decorators/transformer/to-string-array.decorator'
import { CompareWith } from '../../../shared/decorators/validation/compare-with.decorator'
import { IsPrice } from '../../../shared/decorators/validation/is-price.decorator'
import { ToNumber } from '../../../shared/decorators/transformer/to-number.decorator'
import { Expose } from 'class-transformer'
import { EditionPreset } from './edition.preset'


export class EditionFindAllArgs {

    /**
     * Filter set
     */
    @Expose()
    @IsOptional()
    @IsEnum(EditionPreset)
    preset?: EditionPreset

    /**
     * Entities to include in the response
     */
    @Expose()
    @ToStringArray()
    @IsOptional()
    @IsEnum(EditionFindAllInclude, { each: true })
    include?: EditionFindAllInclude[]

    /**
     * ID of the user who is the owner of some nft of any edition
     */
    @Expose()
    @IsOptional()
    @IsUUID('4')
    ownerID?: string

    /**
     * Minimum price in USD of the lowest ask (non-inclusive)
     */
    @Expose()
    @ToNumber()
    @IsOptional()
    @IsPrice()
    minPrice?: number

    /**
     * Maximum price in USD of the lowest ask (non-inclusive)
     */
    @Expose()
    @ToNumber()
    @IsOptional()
    @IsPrice()
    @CompareWith('gte', 'minPrice', true)
    maxPrice?: number

    /**
     * Twitch streamer names for case-insensitive search
     */
    @Expose()
    @ToStringArray()
    @IsOptional()
    streamers?: string[]

    /**
     * Game names for case-insensitive search
     */
    @Expose()
    @ToStringArray()
    @IsOptional()
    games?: string[]

    /**
     * Tag names for case-insensitive search
     */
    @Expose()
    @ToStringArray()
    @IsOptional()
    tags?: string[]

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
