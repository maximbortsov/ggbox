import { CreateGameDataDto } from './CreateGameDataDto'


export class CreateGameDto {
    data: CreateGameDataDto
    file: File | null

    constructor(gameDto: CreateGameDataDto) {
        this.data = gameDto

        // TODO: change
        this.file = null
    }
}