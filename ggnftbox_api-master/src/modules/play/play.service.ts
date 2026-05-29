import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { StreamerService } from '../streamer/streamer.service'
import { PinataService } from '../pinata/pinata.service'
import { CreatePlayDto } from './dto/create-play.dto'
import { LocalFileService } from '../local-file/local-file.service'
import { checkOnlyOneAttr, toKeyValueArray } from '../../shared/utils-function'
import { GameService } from '../game/game.service'
import { PlayFindAllArgs } from './args/play-find-all.args'
import { Play } from './entities/play.entity'
import { PlayFindAllInclude, PlayFindOneInclude } from './args/play.include'
import { PlayPreset } from './args/play.preset'
import { plainToInstance } from 'class-transformer'
import ResponseBoolean from '../../shared/response-boolean'
import { PlayFindOneArgs } from './args/play-find-one.args'
import { ConfigService } from '@nestjs/config'
import { Preferences } from '../../config/preferences'
import { MarketDataService } from './market-data.service'
import { ConnectPlayDto } from './dto/connect-play.dto'
import { Prisma } from '@prisma/client'
import { sendFlowTx } from '../../shared/fcl-wrapper'
import { PrismaService } from '../prisma/prisma.service'


@Injectable()
export class PlayService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly localFileService: LocalFileService,
        private readonly pinataService: PinataService,
        private readonly gameService: GameService,
        private readonly streamerService: StreamerService,
        private readonly marketDataService: MarketDataService,
    ) {
    }

    /**
     * Create Play via Flow transaction and Pinata IPFS
     */
    async sendToCreate({ data, video }: CreatePlayDto): Promise<ResponseBoolean> {

        const streamer = await this.streamerService.findOne(data.streamer.connect)
        const game = await this.gameService.findOne(data.game.connect)

        await this.localFileService.savePlayVideo(video.buffer, data.name)

        const pinResp = await this.pinataService.pinFile(video.buffer, video.originalname, { name: data.name })

        const tx = await sendFlowTx({
            pathTx: 'admin/plays/create_play',
            args: (arg, t) => [
                arg(data.name, t.String),
                arg(data.desc, t.String),
                arg(game.name, t.String),
                arg(streamer.name, t.String),
                arg(pinResp.IpfsHash, t.String),
                arg(toKeyValueArray(data.metadata), t.Dictionary({ key: t.String, value: t.String })),
            ],
        })

        if (tx.errorMessage) {
            throw new InternalServerErrorException(tx.errorMessage)
        }

        return { result: true }
    }

    /**
     * List all Plays with marketplace data
     */
    async findAll(args: PlayFindAllArgs): Promise<Play[]> {

        const includeStreamer = !!args.include?.includes(PlayFindAllInclude.STREAMER)
        const includeFirstEdition = !!args.include?.includes(PlayFindAllInclude.FIRST_EDITION)
        const isMarketPreset = args.preset === PlayPreset.MARKETPLACE

        const tPlays = await this.prisma.play.findMany({
            include: {
                streamer: includeStreamer && {
                    select: {
                        id: true,
                        name: true,
                        user: { select: { avatar: true } },
                    },
                },
                editions: includeFirstEdition && {
                    take: 1,
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
            where: {
                streamer: args.streamers && {
                    name: { in: args.streamers, mode: 'insensitive' },
                },
                game: args.games && {
                    name: { in: args.games, mode: 'insensitive' },
                },
                tags: args.tags && {
                    some: {
                        name: { in: args.tags, mode: 'insensitive' },
                    },
                },
                editions: !(isMarketPreset || args.ownerId) ? undefined : {
                    some: {
                        nfts: {
                            some: {
                                AND: [
                                    { lots: isMarketPreset ? { some: { buyerId: null } } : undefined },
                                    { ownerID: args.ownerId ?? undefined },
                                ],
                            },
                        },
                    },
                },
            },
            skip: args.skip,
            take: args.take,
            orderBy: { createdAt: 'desc' },
        })

        const plays: Play[] = []

        for (const play of tPlays) {
            if (includeStreamer && play.streamer) {
                const streamer = (play as any).streamer
                play['streamer'] = { ...streamer, avatar: streamer.user.avatar }
            }

            const marketplaceData = await this.marketDataService.getMarketplaceDataByPlay(play.id)

            if (marketplaceData.lowestAsk) {
                if (args.minPrice && marketplaceData.lowestAsk.lt(args.minPrice)) {
                    continue
                }
                if (args.maxPrice && marketplaceData.lowestAsk.gt(args.maxPrice)) {
                    continue
                }
            }

            plays.push(
                plainToInstance(Play, {
                    ...play, ...marketplaceData,
                }, { excludeExtraneousValues: true }),
            )
        }

        return plays
    }

    /**
     * Retrieve one Play with marketplace data
     */
    async findOne(key: ConnectPlayDto, args: PlayFindOneArgs): Promise<Play> {
        if (!checkOnlyOneAttr(key)) {
            throw Error('Provide only one of the keys')
        }

        const includeStreamer = !!args.include?.includes(PlayFindOneInclude.STREAMER)
        const includeGame = !!args.include?.includes(PlayFindOneInclude.GAME)
        const includeTags = !!args.include?.includes(PlayFindOneInclude.TAGS)
        const includeNfts = !!args.include?.includes(PlayFindOneInclude.NFTS)
        const includeLots = !!args.include?.includes(PlayFindOneInclude.LOTS)
        const includeEditions = !!args.include?.includes(PlayFindOneInclude.EDITIONS)

        const play = await this.prisma.play.findUniqueOrThrow({
            include: {
                tags: includeTags,
                game: includeGame,
                streamer: includeStreamer && {
                    select: {
                        id: true,
                        name: true,
                        user: { select: { avatar: true } },
                    },
                },
                editions: (includeEditions || includeNfts || includeLots) && {
                    include: {
                        nfts: (includeNfts || includeLots) && {
                            include: {
                                lots: includeLots && { orderBy: { createdAt: 'desc' } },
                            },
                        },
                    },
                },
            },
            where: key,
        })

        if (includeStreamer && play.streamer) {
            const streamer = (play as any).streamer
            play['streamer'] = { ...streamer, avatar: streamer.user.avatar }
        }

        const marketplaceData = await this.marketDataService.getMarketplaceDataByPlay(play.id)

        return plainToInstance(Play, { ...play, ...marketplaceData })
    }

    /**
     * List all popular Play on marketplace
     */
    async getPopular(): Promise<Play[]> {
        const ids = this.configService.get<Preferences>('preferences')?.popularPlayIDs ?? []

        const tPlays = await this.prisma.play.findMany({
            include: {
                streamer: {
                    select: {
                        id: true,
                        name: true,
                        user: { select: { avatar: true } },
                    },
                },
            },
            where: {
                id: { in: ids },
                // TODO || Enable filter for prod
                // nfts: {
                //     some: {
                //         lots: { some: { buyerId: null } },
                //     },
                // },
            },
            orderBy: { createdAt: 'desc' },
        })

        const plays: Play[] = []

        for (const play of tPlays) {
            const marketplaceData = await this.marketDataService.getMarketplaceDataByPlay(play.id)
            const streamer = !play.streamer ? play.streamer : { ...play.streamer, avatar: play.streamer.user.avatar }

            plays.push(
                plainToInstance(Play, {
                    ...play, ...marketplaceData,
                    streamer,
                }, { excludeExtraneousValues: true }),
            )
        }

        return plays
    }

    /**
     * Check if the Play exists
     */
    async exists(key: ConnectPlayDto): Promise<boolean> {
        if (!checkOnlyOneAttr(key)) {
            throw Error('Provide only one of the keys')
        }
        return !!(await this.prisma.play.findUnique({ where: { id: key.id, flowId: key.flowId } }))
    }

    /**
     * Uses to create a Play in DB when Graffle sends data from Flow chain via webhook
     */
    async createPlay(
        name: string,
        desc: string,
        cid: string,
        metadata: Record<string, any>,
        createdAt: Date,
        flowId: string,
        txId: string,
        game: string,
        streamer: string,
    ): Promise<void> {

        const streamerExist = await this.streamerService.exists({ name: streamer })
        if (!streamerExist) {
            metadata['streamer'] = streamer
        }

        await this.prisma.play.create({
            data: {
                name: name,
                desc: desc,
                cid: cid,
                metadata: metadata,
                createdAt: createdAt,
                flowId: flowId,
                transactionId: txId,
                game: {
                    connectOrCreate: {
                        create: { name: game },
                        where: { name: game },
                    },
                },
                streamer: !streamerExist ? {} : { connect: { name: streamer } },
            },
        })
    }

    /**
     * Uses to update Play streamer in DB
     */
    async updatePlayStreamer(
        playID: string,
        streamer: string,
    ): Promise<void> {

        const play = await this.prisma.play.findUniqueOrThrow({
            select: { metadata: true },
            where: { flowId: playID },
        })

        const metadata = play.metadata as Prisma.JsonObject

        const streamerExist = await this.streamerService.exists({ name: streamer })
        if (!streamerExist) {
            metadata['streamer'] = streamer
        }

        await this.prisma.play.update({
            data: {
                ...(
                    streamerExist ?
                        { streamer: { connect: { name: streamer } } }
                        :
                        { streamerId: null, metadata: metadata }
                ),
            },
            where: { flowId: playID },
        })
    }

    /**
     * Uses to update Play game in DB
     */
    async updatePlayGame(
        playID: string,
        game: string,
    ): Promise<void> {

        await this.prisma.play.update({
            data: {
                game: {
                    connectOrCreate: {
                        create: { name: game },
                        where: { name: game },
                    },
                },
            },
            where: { flowId: playID },
        })
    }

}
