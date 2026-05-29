import { Expose, Type } from 'class-transformer'
import { Tag } from './Tag'
import { Streamer } from './Streamer'
import { Game } from './Game'
import { Edition } from './Edition'


export class Play {

    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    desc: string

    @Expose()
    cid: string

    @Expose()
    metadata: Record<string, string>

    @Expose()
    @Type(() => Date)
    createdAt: Date

    @Expose()
    flowId: string

    @Expose()
    transactionId: string

    @Expose()
    streamerId: string | null

    @Expose()
    gameId: string

    @Expose()
    pinataUrl: string

    // Marketplace Data

    @Expose()
    @Type(() => Number)
    nftNum?: number

    @Expose()
    @Type(() => Number)
    lowestAsk?: number | null

    @Expose()
    @Type(() => Number)
    topSale?: number | null

    // Included entities

    @Expose()
    @Type(() => Edition)
    editions?: Edition[]

    @Expose()
    @Type(() => Tag)
    tags?: Tag[]

    @Expose()
    @Type(() => Streamer)
    streamer?: Streamer | null

    @Expose()
    @Type(() => Game)
    game?: Game
}