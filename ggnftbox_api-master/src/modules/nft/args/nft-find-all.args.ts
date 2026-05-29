import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator'
import { ToStringArray } from '../../../shared/decorators/transformer/to-string-array.decorator'
import { NftInclude } from './nft.include'
import { ToNumber } from '../../../shared/decorators/transformer/to-number.decorator'
import { Expose } from 'class-transformer'
import { NftPreset } from './nft.preset'


export class NftFindAllArgs {

    /**
     * Filter set
     */
    @Expose()
    @IsOptional()
    @IsEnum(NftPreset)
    preset?: NftPreset

    /**
     * Entities to include in the response
     */
    @Expose()
    @ToStringArray()
    @IsOptional()
    @IsEnum(NftInclude, { each: true })
    include?: NftInclude[]

    /**
     * ID of the Play that the nfts belong to
     */
    @Expose()
    @IsOptional()
    @IsUUID('4')
    playID?: string

    /**
     * ID of the user who is the owner of nft
     */
    @Expose()
    @IsOptional()
    @IsUUID('4')
    ownerID?: string

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
