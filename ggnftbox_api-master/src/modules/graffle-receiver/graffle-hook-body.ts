import { Expose, Type } from 'class-transformer'


export default class GraffleHookBody {

    /**
     * event id, string hash
     */
    @Expose()
    id: string

    /**
     * project id, giud
     */
    @Expose()
    graffleProjectId: string

    /**
     * company id, giud
     */
    @Expose()
    graffleCompanyId: string

    /**
     * event id on flow chain
     * @example A.921ea449dffec68a.FlovatarMarketplace.FlovatarComponentForSale
     */
    @Expose()
    flowEventId: string

    /**
     * token representing this indexer, guid
     */
    @Expose()
    graffleEventToken: string

    /**
     * block height on flow chain that event occurred at
     */
    @Expose()
    blockHeight: number

    /**
     * DateTimeOffset of when the event occurred
     */
    @Expose()
    @Type(() => Date)
    eventDate: Date

    /**
     * DateTimeOffset of when the event was recorded
     */
    @Expose()
    @Type(() => Date)
    createdAt: Date

    /**
     * object representing the event data on chain
     */
    @Expose()
    blockEventData: Record<string, any>

    /**
     * webhook url
     */
    @Expose()
    webHook: string

    /**
     * transaction id on flow chain
     */
    @Expose()
    flowTransactionId: string
}
