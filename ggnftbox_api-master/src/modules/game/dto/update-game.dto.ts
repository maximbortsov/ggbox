import { UpdateGameDataDto } from './update-game-data.dto'
import { WithNullableFileDto } from '../../../shared/file-dto/with-nullable-file.dto'


export class UpdateGameDto extends WithNullableFileDto(UpdateGameDataDto, { fileDesc: 'File (.svg) upload field' }) {
}
