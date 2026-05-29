import { ShortStreamer } from '../streamer/entities/short-streamer.entity'
import { uniqueBy } from '../../shared/utils-function'
import { Box, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { Game } from '../game/entities/game.entity'


interface BoxIdToNumber {
    [boxId: string]: number | undefined
}


interface SizeIdBoxInput {
    id: string
    size: number
}


export class BoxHelpers {

    static getStreamersFrom(box: Box): ShortStreamer[] {
        const streamers: ShortStreamer[] = []
        for (const nft of box['nfts']) {
            const streamer = nft.edition.play.streamer
            if (streamer) {
                streamers.push({ ...streamer, avatar: streamer.user.avatar })
            }
        }
        return uniqueBy(streamers, 'id')
    }

    static getGamesFrom(box: Box): Game[] {
        const games: Game[] = box['nfts'].map((nft) => nft.edition.play.game)
        return uniqueBy(games, 'id')
    }

    // TODO || Reformat
    static async getTotals(boxes: SizeIdBoxInput[], prisma: PrismaService): Promise<BoxIdToNumber> {

        const ids = boxes.map((b) => b.id)

        const t1 = await prisma.nft.groupBy({
            _count: true,
            where: { boxID: { in: ids } },
            by: ['boxID'],
        })
        const t2 = {}
        for (const t1El of t1) {
            if (t1El.boxID) {
                t2[t1El.boxID] = t1El._count
            }
        }
        const res = {}
        for (const box of boxes) {
            res[box.id] = Math.floor((t2[box.id] ?? 0) / box.size)
        }
        return res
    }

    static async getTotal(box: SizeIdBoxInput, prisma: PrismaService): Promise<number> {

        const t1 = await prisma.nft.groupBy({
            _count: true,
            where: { boxID: box.id },
            by: ['boxID'],
        })
        const count = t1.shift()?._count ?? 0
        return Math.floor(count / box.size)
    }

    static async getInStocks(boxes: SizeIdBoxInput[], prisma: Prisma.TransactionClient | PrismaService): Promise<BoxIdToNumber> {

        const ids = boxes.map((b) => b.id)

        const t1 = await prisma.nft.groupBy({
            _count: true,
            where: {
                ownerID: null,
                boxTokenID: null,
                boxID: { in: ids },
            },
            by: ['boxID'],
        })

        const t2 = {}
        for (const t2El of t1) {
            if (t2El.boxID) {
                t2[t2El.boxID] = t2El._count
            }
        }
        const res = {}
        for (const box of boxes) {
            res[box.id] = Math.floor((t2[box.id] ?? 0) / box.size)
        }
        return res
    }

    static async getInStock(box: SizeIdBoxInput, prisma: Prisma.TransactionClient | PrismaService): Promise<number> {

        const t1 = await prisma.nft.groupBy({
            _count: true,
            where: {
                ownerID: null,
                boxTokenID: null,
                boxID: box.id,
            },
            by: ['boxID'],
        })
        const count = t1.shift()?._count ?? 0
        return Math.floor(count / box.size)
    }
}
