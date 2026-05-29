import { UpdateUserDataDto } from './UpdateUserDataDto'


export class UpdateUserDto {

    data: UpdateUserDataDto
    file: File | ''

    constructor(userDataDto: UpdateUserDataDto) {
        this.data = userDataDto
        this.file = ''
    }

}