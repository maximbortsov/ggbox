import { Expose, Type } from 'class-transformer'
import { Tag } from './Tag'
import { Game } from './Game'
import { Streamer } from './Streamer'


export class GGBox {
    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    size: number

    @Expose()
    total: number

    @Expose()
    inStock: number

    @Expose()
    price: number

    @Expose()
    desc: string

    @Expose()
    openVideo?: string

    @Expose()
    openMobileVideo?: string

    @Expose()
    @Type(() => Date)
    startSaleAt: Date

    @Expose()
    @Type(() => Date)
    endSaleAt: Date

    @Expose()
    thumbnail: string

    @Expose()
    @Type(() => Tag)
    tags?: Tag[]

    @Expose()
    @Type(() => Game)
    games?: Game[]

    @Expose()
    @Type(() => Streamer)
    streamers?: Streamer[]
}