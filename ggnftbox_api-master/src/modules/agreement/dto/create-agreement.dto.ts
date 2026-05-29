import { IsEmail, IsString, MaxLength } from 'class-validator'
import { IsTwitchLink } from '../../../shared/decorators/validation/is-twitch-link.decorator'
import { Expose } from 'class-transformer'


export class CreateAgreementDto {

    @Expose()
    @IsEmail()
    @MaxLength(256)
    email: string

    @Expose()
    @IsString()
    @MaxLength(1000)
    fullName: string

    /**
     * @example https://twitch.tv/twitchName
     */
    @Expose()
    @IsTwitchLink()
    @MaxLength(512)
    twitchLink: string
}
