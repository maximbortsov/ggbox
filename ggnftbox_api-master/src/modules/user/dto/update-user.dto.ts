import { WithNullableFileDto } from '../../../shared/file-dto/with-nullable-file.dto'
import { UpdateUserDataDto } from './update-user-data.dto'


export class UpdateUserDto extends WithNullableFileDto(UpdateUserDataDto) {
}
