import { Injectable } from '@nestjs/common'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { PrismaService } from '../prisma/prisma.service'
import { Tag } from './entities/tag.entity'


@Injectable()
export class TagService {
    constructor(
        private readonly prisma: PrismaService,
    ) {
    }

    async create(dto: CreateTagDto): Promise<Tag> {
        return this.prisma.tag.create({ data: dto })
    }

    async findAll(): Promise<Tag[]> {
        return this.prisma.tag.findMany()
    }

    async findOne(id: string): Promise<Tag> {
        return this.prisma.tag.findUniqueOrThrow({ where: { id: id } })
    }

    async update(id: string, dto: UpdateTagDto): Promise<Tag> {
        return this.prisma.tag.update({
            where: { id: id },
            data: dto,
        })
    }

    async remove(id: string): Promise<Tag> {
        return this.prisma.tag.delete({ where: { id: id } })
    }
}
