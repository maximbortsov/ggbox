import { Expose, Type } from 'class-transformer'
import { Edition } from '../../edition/entities/edition.entity'
import { ShortUser } from '../../user/entities/short-user.entity'
import { Lot } from '../../lot/entities/lot.entity'


export class Nft {

    @Expose()
    id: string

    @Expose()
    @Type(() => String)
    flowID: string

    @Expose()
    @Type(() => String)
    flowEditionID: string

    @Expose()
    @Type(() => String)
    serialNumber: string

    @Expose()
    @Type(() => Date)
    mintingDate: Date

    @Expose()
    metadata: Record<string, string>

    @Expose()
    transactionID: string

    @Expose()
    ownerID: string | null

    @Expose()
    editionID: string

    @Expose()
    boxID: string | null

    @Expose()
    boxTokenID: string | null

    // Included entities

    @Expose()
    @Type(() => Edition)
    edition?: Edition

    @Expose()
    @Type(() => ShortUser)
    owner?: ShortUser | null

    @Expose()
    @Type(() => Lot)
    lots?: Lot[]

}
