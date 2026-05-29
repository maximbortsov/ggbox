import { IsDefined, IsObject, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { ConnectGameDto } from '../../game/dto/connect-game.dto'
import { ConnectStreamerDto } from '../../streamer/dto/connect-streamer.dto'


export class CreatePlayGameRelationInputDto {

    @Expose()
    @Type(() => ConnectGameDto)
    @IsDefined()
    @ValidateNested()
    connect: ConnectGameDto
}


export class CreatePlayStreamerRelationInputDto {

    @Expose()
    @Type(() => ConnectStreamerDto)
    @IsDefined()
    @ValidateNested()
    connect: ConnectStreamerDto
}


export class CreatePlayDataDto {

    @Expose()
    @IsString()
    @MinLength(6)
    @MaxLength(256)
    name: string

    @Expose()
    @IsString()
    @MinLength(10)
    @MaxLength(512)
    desc: string

    @Expose()
    @IsObject()
    metadata: Record<string, string>

    @Expose()
    @Type(() => CreatePlayStreamerRelationInputDto)
    @IsDefined()
    @ValidateNested()
    streamer: CreatePlayStreamerRelationInputDto

    @Expose()
    @Type(() => CreatePlayGameRelationInputDto)
    @IsDefined()
    @ValidateNested()
    game: CreatePlayGameRelationInputDto
}
