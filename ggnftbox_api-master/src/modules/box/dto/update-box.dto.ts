import { UpdateBoxDataDto } from './update-box-data.dto'
import { WithOptionalFileDto } from '../../../shared/file-dto/with-optional-file.dto'


export class UpdateBoxDto extends WithOptionalFileDto(UpdateBoxDataDto) {
}
