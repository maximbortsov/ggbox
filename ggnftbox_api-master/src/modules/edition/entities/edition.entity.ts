import { Expose, Type } from 'class-transformer'
import { Play } from '../../play/entities/play.entity'
import { Nft } from '../../nft/entities/nft.entity'


export class Edition {

    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    rarity: string

    @Expose()
    @Type(() => String)
    maxMintSize: string | null

    @Expose()
    @Type(() => String)
    flowId: string

    @Expose()
    @Type(() => String)
    flowSetId: string

    @Expose()
    @Type(() => String)
    flowPlayId: string

    @Expose()
    transactionId: string

    @Expose()
    @Type(() => Date)
    createdAt: Date

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
    @Type(() => Play)
    play?: Play

    @Expose()
    @Type(() => Nft)
    nfts?: Nft[]

}
