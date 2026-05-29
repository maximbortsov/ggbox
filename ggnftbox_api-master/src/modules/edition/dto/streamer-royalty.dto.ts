import { IsDefined, IsNumber, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { ConnectStreamerDto } from '../../streamer/dto/connect-streamer.dto'


export class CreateStreamerRoyaltyStreamerRelationInputDto {

    @Expose()
    @Type(() => ConnectStreamerDto)
    @IsDefined()
    @ValidateNested()
    connect: ConnectStreamerDto
}


export class StreamerRoyaltyDto {

    @Expose()
    @Type(() => CreateStreamerRoyaltyStreamerRelationInputDto)
    @IsDefined()
    @ValidateNested()
    streamer: CreateStreamerRoyaltyStreamerRelationInputDto

    @Expose()
    @IsNumber()
    royalty: number
}
