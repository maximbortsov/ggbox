import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Game } from './entities/game.entity'
import { LocalFileService } from '../local-file/local-file.service'
import { UpdateGameDto } from './dto/update-game.dto'
import { CreateGameDto } from './dto/create-game.dto'
import { ConnectGameDto } from './dto/connect-game.dto'
import { checkOnlyOneAttr } from '../../shared/utils-function'


@Injectable()
export class GameService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly localFileService: LocalFileService,
    ) {
    }

    async exists(key: ConnectGameDto): Promise<boolean> {
        if (!checkOnlyOneAttr(key)) {
            throw Error('Provide only one of the keys')
        }
        return !!(await this.prisma.game.findUnique({ where: { id: key.id, name: key.name } }))
    }

    async create({ data, file }: CreateGameDto): Promise<Game> {
        return this.prisma.$transaction(async (prisma): Promise<Game> => {
            let game = await prisma.game.create({ data: data })

            if (file) {
                const toFile = await this.localFileService.saveGameLogo(file.buffer, game.id)
                game = await prisma.game.update({
                    where: { id: game.id },
                    data: { logo: toFile },
                })
            }
            return game
        })
    }

    async findAll(): Promise<Game[]> {
        return this.prisma.game.findMany()
    }

    async findOne(key: ConnectGameDto): Promise<Game> {
        if (!checkOnlyOneAttr(key)) {
            throw Error('Provide only one of the keys')
        }
        return this.prisma.game.findUniqueOrThrow({ where: key })
    }

    async update(id: string, { data, file }: UpdateGameDto): Promise<Game> {
        let toFile: string | null | undefined

        return this.prisma.$transaction(async (prisma): Promise<Game> => {
            const { logo } = await prisma.game.update({
                where: { id: id },
                select: { logo: true },
                data: data,
            })

            if (file) {
                toFile = await this.localFileService.saveGameLogo(file.buffer, id)
            } else if (file === null && logo) {
                await this.localFileService.removeFile(logo)
                toFile = null
            }

            return prisma.game.update({
                where: { id: id },
                data: { logo: toFile },
            })
        })
    }

    async remove(id: string): Promise<Game> {
        return this.prisma.$transaction(async (prisma): Promise<Game> => {
            const { logo } = await prisma.game.findUniqueOrThrow({
                where: { id: id },
                select: { logo: true },
            })

            if (logo) {
                await this.localFileService.removeFile(logo)
            }

            return prisma.game.delete({ where: { id: id } })
        })
    }
}
