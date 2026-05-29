import { Expose, Type } from 'class-transformer'
import { User } from './User'


export class Deposit {
    @Expose()
    id: string

    @Expose()
    amount: number

    @Expose()
    @Type(() => Date)
    updatedAt: Date

    @Expose()
    @Type(() => Date)
    createdAt: Date

    @Expose()
    status: string

    @Type(() => User)
    user?: User
}