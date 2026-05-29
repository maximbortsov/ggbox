import { CreateGameDataDto } from './create-game-data.dto'
import { WithNullableFileDto } from '../../../shared/file-dto/with-nullable-file.dto'


export class CreateGameDto extends WithNullableFileDto(CreateGameDataDto, { fileDesc: 'File (.svg) upload field' }) {
}
