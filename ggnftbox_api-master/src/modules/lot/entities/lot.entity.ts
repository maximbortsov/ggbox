import { Expose, Type } from 'class-transformer'
import { Nft } from '../../nft/entities/nft.entity'
import { ShortUser } from '../../user/entities/short-user.entity'


export class Lot {

    @Expose()
    id: string

    @Expose()
    @Type(() => Number)
    price: number

    @Expose()
    @Type(() => Date)
    soldAt: Date | null

    @Expose()
    @Type(() => Date)
    updatedAt: Date

    @Expose()
    @Type(() => Date)
    createdAt: Date

    @Expose()
    @Type(() => String)
    flowNftId: string

    @Expose()
    nftId: string

    @Expose()
    buyerId: string | null

    @Expose()
    sellerId: string

    @Expose()
    transactionID: string

    @Expose()
    purchaseTransactionID: string

    // Included entities

    @Expose()
    @Type(() => Nft)
    nft?: Nft

    @Expose()
    @Type(() => ShortUser)
    buyer?: ShortUser | null

    @Expose()
    @Type(() => ShortUser)
    seller?: ShortUser
}
