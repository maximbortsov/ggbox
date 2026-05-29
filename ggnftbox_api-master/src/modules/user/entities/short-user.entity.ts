import { Expose } from 'class-transformer'
import { User } from './user.entity'


export class ShortUser implements Pick<User, 'id' | 'username' | 'avatar'> {

    @Expose()
    id: string

    @Expose()
    username: string

    @Expose()
    avatar: string | null

    @Expose()
    flowWallet: string
}
