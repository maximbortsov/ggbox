import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { IsTwitchLink } from '../../../shared/decorators/validation/is-twitch-link.decorator'
import { Expose } from 'class-transformer'


export class UpdateAgreementDto {

    @Expose()
    @IsOptional()
    @IsEmail()
    @MaxLength(256)
    email?: string

    @Expose()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(1000)
    fullName?: string

    /**
     * @example https://twitch.tv/twitchName
     */
    @Expose()
    @IsOptional()
    @IsTwitchLink()
    @MaxLength(512)
    twitchLink?: string
}
