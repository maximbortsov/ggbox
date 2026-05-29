import { Expose, Type } from 'class-transformer'
import { Box } from '../../box/entities/box.entity'


export class BoxToken {

    @Expose()
    id: string

    @Expose()
    isOpen: boolean

    @Expose()
    @Type(() => Date)
    createdAt: Date

    @Expose()
    boxId: string

    // Included entities

    @Expose()
    @Type(() => Box)
    box: Box

}
