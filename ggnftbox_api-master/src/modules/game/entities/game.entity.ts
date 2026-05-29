import { Expose } from 'class-transformer'


export class Game {

    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    logo: string | null
}
