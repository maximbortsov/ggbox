import { Expose, Type } from 'class-transformer'


export class GGSet {

    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    setPlaysInEditions: Record<string, string>

    @Expose()
    @Type(() => String)
    flowId: string

    @Expose()
    transactionId: string

    @Expose()
    @Type(() => Date)
    createdAt: Date

}
