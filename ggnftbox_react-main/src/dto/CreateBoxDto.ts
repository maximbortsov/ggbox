import { CreateBoxDataDto } from './CreateBoxDataDto'


export class CreateBoxDto {

    data: CreateBoxDataDto
    file: File | null

    constructor(boxDataDto: CreateBoxDataDto, image: File) {
        this.data = boxDataDto
        this.file = image
    }

}