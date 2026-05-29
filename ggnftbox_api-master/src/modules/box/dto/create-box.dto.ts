import { WithFileDto } from '../../../shared/file-dto/with-file.dto'
import { CreateBoxDataDto } from './create-box-data.dto'


export class CreateBoxDto extends WithFileDto(CreateBoxDataDto) {
}
