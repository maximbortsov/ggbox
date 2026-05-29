import { Nft } from '../../nft/entities/nft.entity'
import { Expose, Type } from 'class-transformer'
import { PlayLot } from './play-lot.entity'
import { ShortUser } from '../../user/entities/short-user.entity'


export class PlayNft implements Pick<Nft, 'id' | 'flowID' | 'serialNumber'> {

    @Expose()
    id: string

    @Expose()
    @Type(() => String)
    flowID: string

    @Expose()
    @Type(() => String)
    serialNumber: string

    // Included entities

    @Expose()
    @Type(() => ShortUser)
    owner?: ShortUser | null

    @Expose()
    @Type(() => PlayLot)
    lots?: PlayLot[]
}
