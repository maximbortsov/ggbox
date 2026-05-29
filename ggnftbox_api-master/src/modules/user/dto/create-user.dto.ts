import { WithNullableFileDto } from '../../../shared/file-dto/with-nullable-file.dto'
import { CreateUserDataDto } from './create-user-data.dto'


export class CreateUserDto extends WithNullableFileDto(CreateUserDataDto) {
}
