import { ConnectUserDto } from '../../user/dto/connect-user.dto'
import { IsDefined, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { IsTwitchLink } from '../../../shared/decorators/validation/is-twitch-link.decorator'


export class UpdateStreamerUserRelationInputDto {

    @Expose()
    @Type(() => ConnectUserDto)
    @IsDefined()
    @ValidateNested()
    connect: ConnectUserDto
}


export class UpdateStreamerDto {

    @Expose()
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(256)
    desc?: string

    @Expose()
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(256)
    name?: string

    /**
     * @example https://twitch.tv/twitchName
     */
    @Expose()
    @IsOptional()
    @IsTwitchLink()
    @MaxLength(512)
    twitchLink?: string

    @Expose()
    @Type(() => UpdateStreamerUserRelationInputDto)
    @IsOptional()
    @ValidateNested()
    user?: UpdateStreamerUserRelationInputDto
}
