import { Expose, Type } from 'class-transformer'
import { Play } from './Play'
import { Nft } from './Nft'


export class Edition {

    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    rarity: string

    @Expose()
    maxMintSize: string | null

    @Expose()
    flowId: string

    @Expose()
    flowSetId: string

    @Expose()
    flowPlayId: string

    @Expose()
    transactionId: string

    @Expose()
    @Type(() => Date)
    createdAt: Date

    // Included entities

    @Expose()
    @Type(() => Play)
    play?: Play

    @Expose()
    @Type(() => Nft)
    nfts?: Nft[]

}