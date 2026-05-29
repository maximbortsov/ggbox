import { Expose, Type } from 'class-transformer'
import { Nft } from './Nft'
import { User } from './User'


export class Lot {

    @Expose()
    id: string

    @Expose()
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
    nftId: string

    @Expose()
    buyerId: string | null

    @Expose()
    sellerId: string

    @Expose()
    purchaseTransactionID?: string

    @Expose()
    @Type(() => Nft)
    nft?: Nft

    @Expose()
    @Type(() => User)
    buyer?: User

    @Expose()
    @Type(() => User)
    seller?: User
}
