import { Injectable } from '@nestjs/common'
import { CreateStreamerDto } from './dto/create-streamer.dto'
import { UpdateStreamerDto } from './dto/update-streamer.dto'
import { PrismaService } from '../prisma/prisma.service'
import { Streamer } from './entities/streamer.entity'
import { checkOnlyOneAttr } from '../../shared/utils-function'
import { ConnectStreamerDto } from './dto/connect-streamer.dto'


@Injectable()
export class StreamerService {
    constructor(
        private readonly prisma: PrismaService,
    ) {
    }

    async exists(key: ConnectStreamerDto): Promise<boolean> {
        if (!checkOnlyOneAttr(key)) {
            throw Error('Provide only one of the keys')
        }
        return !!(await this.prisma.streamer.findUnique({ where: { id: key.id, name: key.name } }))
    }

    async create(dto: CreateStreamerDto): Promise<Streamer> {
        return this.prisma.streamer.create({ data: dto })
    }

    async findAll(): Promise<Streamer[]> {
        return this.prisma.streamer.findMany()
    }

    async findOne(key: ConnectStreamerDto): Promise<Streamer> {
        if (!checkOnlyOneAttr(key)) {
            throw Error('Provide only one of the keys')
        }
        return this.prisma.streamer.findUniqueOrThrow({ where: key })
    }

    async update(id: string, dto: UpdateStreamerDto): Promise<Streamer> {
        return this.prisma.streamer.update({
            where: { id: id },
            data: dto,
        })
    }

    async remove(id: string): Promise<Streamer> {
        return this.prisma.streamer.delete({ where: { id: id } })
    }
}
