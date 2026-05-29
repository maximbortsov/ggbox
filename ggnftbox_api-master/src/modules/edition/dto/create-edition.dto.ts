import {
    IsDefined,
    IsEnum,
    IsNumberString,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { ConnectPlayDto } from '../../play/dto/connect-play.dto'
import { ConnectSetDto } from '../../set/dto/connect-set.dto'
import { StreamerRoyaltyDto } from './streamer-royalty.dto'
import { Rarity } from '../../../shared/consts/rarity'


export class CreateEditionPlayRelationInputDto {

    @Expose()
    @Type(() => ConnectPlayDto)
    @IsDefined()
    @ValidateNested()
    connect: ConnectPlayDto
}


export class CreateEditionSetRelationInputDto {

    @Expose()
    @Type(() => ConnectSetDto)
    @IsDefined()
    @ValidateNested()
    connect: ConnectSetDto
}


export class CreateEditionDto {

    @Expose()
    @IsString()
    @MinLength(6)
    @MaxLength(256)
    name: string

    @Expose()
    @IsOptional()
    @IsString()
    @IsNumberString({ no_symbols: true })
    @MaxLength(20)
    maxMintSize?: string

    @Expose()
    @IsString()
    @MinLength(2)
    @MaxLength(256)
    @IsEnum(Rarity)
    rarity: string

    @Expose()
    @Type(() => StreamerRoyaltyDto)
    @IsDefined()
    @ValidateNested()
    streamerRoyalties: StreamerRoyaltyDto[]

    @Expose()
    @Type(() => CreateEditionPlayRelationInputDto)
    @IsDefined()
    @ValidateNested()
    play: CreateEditionPlayRelationInputDto

    @Expose()
    @Type(() => CreateEditionSetRelationInputDto)
    @IsDefined()
    @ValidateNested()
    set: CreateEditionSetRelationInputDto

}
