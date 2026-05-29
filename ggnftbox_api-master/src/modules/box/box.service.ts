import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Box } from './entities/box.entity'
import { LocalFileService } from '../local-file/local-file.service'
import { UpdateBoxDto } from './dto/update-box.dto'
import { CreateBoxDto } from './dto/create-box.dto'
import { BoxFindOneArgs } from './args/box-find-one.args'
import { BoxInclude } from './args/box.include'
import { plainToInstance } from 'class-transformer'
import { BoxFindAllArgs } from './args/box-find-all.args'
import { UpdateBoxVideoDto } from './dto/update-box-video.dto'
import { ConfigService } from '@nestjs/config'
import { BoxHelpers } from './box-helpers'
import { sortBy } from '../../shared/utils-function'


@Injectable()
export class BoxService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly localFileService: LocalFileService,
    ) {
    }

    async create({ data, file }: CreateBoxDto): Promise<Box> {
        return this.prisma.$transaction(async (prisma): Promise<Box> => {
            let box = await prisma.box.create({
                data: {
                    ...data,
                    thumbnail: '',
                    openVideo: '',
                    openMobileVideo: '',
                },
            })

            const toFile = await this.localFileService.saveBoxThumbnail(file.buffer, box.id)
            box = await prisma.box.update({
                where: { id: box.id },
                data: { thumbnail: toFile },
            })
            return plainToInstance(Box, box)
        })
    }

    async findAll(args: BoxFindAllArgs): Promise<Box[]> {

        const includeStreamer = !!args.include?.includes(BoxInclude.STREAMERS)
        const includeGame = !!args.include?.includes(BoxInclude.GAMES)
        const includeTags = !!args.include?.includes(BoxInclude.TAGS)

        const tBoxes = await this.prisma.box.findMany({
            include: {
                tags: includeTags,
                nfts: (includeStreamer || includeGame) && {
                    select: {
                        edition: {
                            select: {
                                play: {
                                    select: {
                                        streamer: includeStreamer && {
                                            select: {
                                                id: true,
                                                name: true,
                                                user: { select: { avatar: true } },
                                            },
                                        },
                                        game: includeGame,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                nfts: (args.streamers || args.games) && {
                    some: {
                        edition: {
                            play: {
                                streamer: {
                                    name: { in: args.streamers, mode: 'insensitive' },
                                },
                                game: {
                                    name: { in: args.games, mode: 'insensitive' },
                                },
                            },
                        },
                    },
                },
                tags: args.tags && {
                    some: {
                        name: { in: args.tags, mode: 'insensitive' },
                    },
                },
            },
            skip: args.skip,
            take: args.take,
            orderBy: [
                { createdAt: 'desc' },
            ],
        })

        let boxes: Box[] = []

        const totals = await BoxHelpers.getTotals(tBoxes, this.prisma)
        const inStocks = await BoxHelpers.getInStocks(tBoxes, this.prisma)

        for (const box of tBoxes) {
            box['total'] = totals[box.id] ?? 0
            box['inStock'] = inStocks[box.id] ?? 0
            if (includeStreamer) {
                box['streamers'] = BoxHelpers.getStreamersFrom(box)
            }
            if (includeGame) {
                box['games'] = BoxHelpers.getGamesFrom(box)
            }
            boxes.push(plainToInstance(Box, box))
        }

        boxes = sortBy(boxes, 'inStock', true)

        return boxes
    }

    async findOne(id: string, args: BoxFindOneArgs): Promise<Box> {

        const includeStreamer = !!args.include?.includes(BoxInclude.STREAMERS)
        const includeGame = !!args.include?.includes(BoxInclude.GAMES)
        const includeTags = !!args.include?.includes(BoxInclude.TAGS)

        const box = await this.prisma.box.findUniqueOrThrow({
            include: {
                tags: includeTags,
                nfts: (includeStreamer || includeGame) && {
                    select: {
                        edition: {
                            select: {
                                play: {
                                    select: {
                                        streamer: includeStreamer && {
                                            select: {
                                                id: true,
                                                name: true,
                                                user: { select: { avatar: true } },
                                            },
                                        },
                                        game: includeGame,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: { id: id },
        })

        box['total'] = await BoxHelpers.getTotal(box, this.prisma)
        box['inStock'] = await BoxHelpers.getInStock(box, this.prisma)
        if (includeStreamer) {
            box['streamers'] = BoxHelpers.getStreamersFrom(box)
        }
        if (includeGame) {
            box['games'] = BoxHelpers.getGamesFrom(box)
        }

        return plainToInstance(Box, box)
    }

    async update(id: string, { data, file }: UpdateBoxDto): Promise<Box> {
        let toFile: string | undefined

        return this.prisma.$transaction(async (prisma): Promise<Box> => {
            await prisma.box.update({
                where: { id: id },
                select: { thumbnail: true },
                data: data,
            })

            if (file) {
                toFile = await this.localFileService.saveBoxThumbnail(file.buffer, id)
            }

            const box = await prisma.box.update({
                where: { id: id },
                data: { thumbnail: toFile },
            })
            return plainToInstance(Box, box)
        })
    }

    async updateOpenVideo(id: string, { file }: UpdateBoxVideoDto): Promise<Box> {
        return this.prisma.$transaction(async (prisma): Promise<Box> => {
            await prisma.box.findUniqueOrThrow({
                where: { id: id },
            })

            const toFile = await this.localFileService.saveBoxOpenVideo(file.buffer, id)

            const box = await prisma.box.update({
                where: { id: id },
                data: { openVideo: toFile },
            })
            return plainToInstance(Box, box)
        })
    }

    async updateOpenMobileVideo(id: string, { file }: UpdateBoxVideoDto): Promise<Box> {
        return this.prisma.$transaction(async (prisma): Promise<Box> => {
            await prisma.box.findUniqueOrThrow({
                where: { id: id },
            })

            const toFile = await this.localFileService.saveBoxOpenMobileVideo(file.buffer, id)

            const box = await prisma.box.update({
                where: { id: id },
                data: { openMobileVideo: toFile },
            })
            return plainToInstance(Box, box)
        })
    }

    async remove(id: string): Promise<Box> {
        return this.prisma.$transaction(async (prisma): Promise<Box> => {
            const { thumbnail } = await prisma.box.findUniqueOrThrow({
                where: { id: id },
                select: { thumbnail: true },
            })

            await this.localFileService.removeFile(thumbnail)

            const box = await prisma.box.delete({ where: { id: id } })
            return plainToInstance(Box, box)
        })
    }

}
