import { BoxInclude } from './box.include'
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator'
import { ToStringArray } from '../../../shared/decorators/transformer/to-string-array.decorator'
import { ToNumber } from '../../../shared/decorators/transformer/to-number.decorator'
import { Expose } from 'class-transformer'


export class BoxFindAllArgs {

    @Expose()
    @ToStringArray()
    @IsOptional()
    @IsEnum(BoxInclude, { each: true })
    include?: BoxInclude[]

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

    @Expose()
    @ToNumber()
    @IsOptional()
    @IsInt()
    @Min(0)
    skip?: number

    @Expose()
    @ToNumber()
    @IsOptional()
    @IsInt()
    @Min(1)
    take?: number
}
