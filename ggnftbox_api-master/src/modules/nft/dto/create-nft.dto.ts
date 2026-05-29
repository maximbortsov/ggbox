import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { ConnectEditionDto } from '../../edition/dto/connect-edition.dto'


export class CreateNftEditionRelationInputDto {

    @Expose()
    @Type(() => ConnectEditionDto)
    @IsDefined()
    @ValidateNested()
    connect: ConnectEditionDto
}


export class CreateNftDto {

    @Expose()
    @IsObject()
    metadata: Record<string, string>

    @Expose()
    @Type(() => CreateNftEditionRelationInputDto)
    @IsDefined()
    @ValidateNested()
    edition: CreateNftEditionRelationInputDto

}
