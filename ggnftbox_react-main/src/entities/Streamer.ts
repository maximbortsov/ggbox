import { Expose, Type } from 'class-transformer'
import { User } from './User'


export class Streamer {
    @Expose()
    id: string

    @Expose()
    desc: string | null

    @Expose()
    name: string

    @Expose()
    twitchLink: string | null

    @Expose()
    userId: string

    @Expose()
    avatar: string | null

    @Type(() => User)
    user?: User
}
