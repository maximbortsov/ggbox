import { Expose } from 'class-transformer'
import { Streamer } from './streamer.entity'


export class ShortStreamer implements Pick<Streamer, 'id' | 'name'> {

    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    avatar: string | null
}
