import { Expose, Type } from 'class-transformer'


export enum TypeTransaction {
    BUY_LOT = 'buy-lot',
    BUY_BOX = 'buy-box'
}


export class UserTransaction {

    @Expose()
    type: TypeTransaction

    @Expose()
    @Type(() => String)
    amount: string

    @Expose()
    @Type(() => Date)
    date: Date
}
