import { Expose, Type } from 'class-transformer'


export class Agreement {

    @Expose()
    id: string

    @Expose()
    email: string

    @Expose()
    fullName: string

    @Expose()
    twitchLink: string

    @Expose()
    @Type(() => Date)
    updatedAt: Date

    @Expose()
    @Type(() => Date)
    createdAt: Date
}
