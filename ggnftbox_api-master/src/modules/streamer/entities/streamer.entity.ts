import { Expose } from 'class-transformer'


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

 // @Type(() => User)
 // user?: User
}
