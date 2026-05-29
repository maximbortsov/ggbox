import { CreatePlayDataDto } from './CreatePlayDataDto'


export class CreatePlayDto {

    data: CreatePlayDataDto
    video: File | null

    constructor(playDataDto: CreatePlayDataDto, video: File) {
        this.data = playDataDto
        this.video = video
    }

}