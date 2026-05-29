import { Game } from '../../game/entities/game.entity'
import { Expose, Type } from 'class-transformer'
import { ShortStreamer } from '../../streamer/entities/short-streamer.entity'
import { Tag } from '../../tag/entities/tag.entity'


export class Box {

    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    size: number

    @Expose()
    total?: number

    @Expose()
    inStock?: number

    @Expose()
    price: number

    @Expose()
    desc: string

    @Expose()
    @Type(() => Date)
    startSaleAt: Date

    @Expose()
    @Type(() => Date)
    endSaleAt: Date

    @Expose()
    thumbnail: string

    @Expose()
    openVideo: string

    @Expose()
    openMobileVideo: string

    @Expose()
    @Type(() => Game)
    games?: Game[]

    @Expose()
    @Type(() => ShortStreamer)
    streamers?: ShortStreamer[]

    @Expose()
    @Type(() => Tag)
    tags?: Tag[]
}
