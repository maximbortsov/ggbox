import { PrismaService } from '../prisma/prisma.service'
import { StreamerService } from '../streamer/streamer.service'
import { Streamer } from '../streamer/entities/streamer.entity'
import { StreamerRoyaltyDto } from './dto/streamer-royalty.dto'
import { Injectable } from '@nestjs/common'


export interface StreamerRoyalty {
    streamer: Streamer
    royalty: number
}


@Injectable()
export class StreamerRoyaltyService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly streamerService: StreamerService,
    ) {
    }

    async checkRoyalty(dto: StreamerRoyaltyDto): Promise<StreamerRoyalty> {
        const streamer = await this.streamerService.findOne(dto.streamer.connect)
        return { streamer: streamer, royalty: dto.royalty }
    }

    async checkRoyalties(dtos: StreamerRoyaltyDto[]): Promise<StreamerRoyalty[]> {

        const res: StreamerRoyalty[] = []

        for (const dto of dtos) {
            res.push(await this.checkRoyalty(dto))
        }

        return res
    }

}
