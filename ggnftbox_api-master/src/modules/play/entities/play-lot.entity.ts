import { Lot } from '../../lot/entities/lot.entity'
import { Expose, Type } from 'class-transformer'
import { ShortUser } from '../../user/entities/short-user.entity'


export class PlayLot implements Pick<Lot, 'id' | 'price' | 'soldAt'> {

    @Expose()
    id: string

    @Expose()
    price: number

    @Expose()
    @Type(() => Date)
    soldAt: Date | null

    // Included entities

    @Expose()
    @Type(() => ShortUser)
    buyer: ShortUser | null

    @Expose()
    @Type(() => ShortUser)
    seller: ShortUser
}
