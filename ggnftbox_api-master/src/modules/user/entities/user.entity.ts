import { Exclude, Expose, Type } from 'class-transformer'
import { ApiHideProperty } from '@nestjs/swagger'
import { Roles } from '../../../config/roles'


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
    @ApiHideProperty()
    password: string

    @Expose()
    isEmailConfirmed: boolean

    @Expose()
    flowWallet: string

    @Expose()
    roles: Roles[]

    @Expose()
    @Type(() => Date)
    updatedAt: Date

    @Expose()
    @Type(() => Date)
    createdAt: Date
}
