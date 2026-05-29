export class CreatePlayDataDto {

    name: string
    desc: string
    streamer: { connect: { id: string } | { name: string } }
    game: { connect: { id: string } | { name: string } }

}