import { Exclude, Expose, Type } from 'class-transformer'


export class User {
    @Expose()
    id: string

    @Expose()
    username: string

    @Expose()
    email: string

    @Expose()
    avatar: string | null

    @Exclude()
    password: string

    @Expose()
    balance: number

    @Expose()
    isEmailConfirmed: boolean

    @Expose()
    roles: string[]

    @Expose()
    flowWallet?: string

    @Expose()
    @Type(() => Date)
    updatedAt: Date

    @Expose()
    @Type(() => Date)
    createdAt: Date
}