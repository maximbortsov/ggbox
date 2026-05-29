import { Expose, Type } from 'class-transformer'
import { User } from './User'
import { Edition } from './Edition'
import { Lot } from './Lot'


export class Nft {
    @Expose()
    id: string

    @Expose()
    flowID: string

    @Expose()
    flowEditionID: string

    @Expose()
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

    // Included entities

    @Expose()
    @Type(() => Edition)
    edition?: Edition

    @Expose()
    @Type(() => User)
    owner?: User | null

    @Expose()
    @Type(() => Lot)
    lots?: Lot[]

}
