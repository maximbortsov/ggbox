export class CreateStreamerDto {
    desc: string
    name: string
    twitchLink: string
    user = { connect: { id: '' } }
}