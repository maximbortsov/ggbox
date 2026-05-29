import { Expose, Type } from 'class-transformer'
import { Tag } from '../../tag/entities/tag.entity'
import { Game } from '../../game/entities/game.entity'
import { ShortStreamer } from '../../streamer/entities/short-streamer.entity'
import config from '../../../config/config'
import { ApiProperty } from '@nestjs/swagger'
import { PinataService } from '../../pinata/pinata.service'
import { Edition } from '../../edition/entities/edition.entity'


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
    @Type(() => String)
    flowId: string

    @Expose()
    transactionId: string

    @Expose()
    streamerId: string | null

    @Expose()
    gameId: string

    /**
     * IPFS Url with cid and Pinata dedicated gateway
     */
    @Expose()
    @ApiProperty()
    get pinataUrl(): string {
        const gatewayUrl = config().pinata.gatewayUrl
        return PinataService.getPinataGatewayURL(this.cid, gatewayUrl)
    }

    // Marketplace Data

    @Expose()
    @Type(() => String)
    nftNumMinted?: string

    @Expose()
    @Type(() => String)
    lowestAsk?: string | null

    @Expose()
    @Type(() => String)
    topSale?: string | null

    // Included entities

    @Expose()
    @Type(() => Edition)
    editions?: Edition[]

    @Expose()
    @Type(() => Tag)
    tags?: Tag[]

    @Expose()
    @Type(() => ShortStreamer)
    streamer?: ShortStreamer | null

    @Expose()
    @Type(() => Game)
    game?: Game
}
