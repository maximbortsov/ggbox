import { CreateUserDataDto } from './CreateUserDataDto'


export class CreateUserDto {

    data: CreateUserDataDto
    file: File | ''

    constructor(userDataDto: CreateUserDataDto) {
        this.data = userDataDto
        this.file = ''
    }

}