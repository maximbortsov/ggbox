import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import ResponseBoolean from '../../shared/response-boolean'
import { PlayService } from '../play/play.service'
import { SetService } from '../set/set.service'
import { CreateEditionDto } from './dto/create-edition.dto'
import { StreamerRoyaltyService } from './streamer-royalty.service'
import { checkRarityExist } from '../../shared/consts/rarity'
import { checkOnlyOneAttr, toKeyValueArray } from '../../shared/utils-function'
import { plainToInstance } from 'class-transformer'
import { ConnectEditionDto } from './dto/connect-edition.dto'
import { Edition } from './entities/edition.entity'
import { EditionFindAllArgs } from './args/edition-find-all.args'
import { EditionPreset } from './args/edition.preset'
import { EditionFindAllInclude, EditionFindOneInclude } from './args/edition.include'
import { MarketDataService } from '../play/market-data.service'
import { EditionFindOneArgs } from './args/edition-find-one.args'
import { ConfigService } from '@nestjs/config'
import { sendFlowTx } from '../../shared/fcl-wrapper'


@Injectable()
export class EditionService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly playService: PlayService,
        private readonly setService: SetService,
        private readonly streamerRoyaltyService: StreamerRoyaltyService,
        private readonly marketDataService: MarketDataService,
    ) {
    }

    /**
     * Create Edition via Flow transaction
     */
    async sendToCreate(dto: CreateEditionDto): Promise<ResponseBoolean> {

        const streamers = await this.streamerRoyaltyService.checkRoyalties(dto.streamerRoyalties)
        const play = await this.playService.findOne(dto.play.connect, {})
        const set = await this.setService.findOne(dto.set.connect)

        const streamerNameToRoyalty = {}
        for (const el of streamers) {
            if (el.royalty) {
                streamerNameToRoyalty[el.streamer.name] = el.royalty.toFixed(8)
            }
        }

        if (!checkRarityExist(dto.rarity)) {
            throw new BadRequestException('Provide valid rarity for Edition')
        }

        const tx = await sendFlowTx({
            pathTx: 'admin/editions/create_edition',
            args: (arg, t) => [
                arg(set.flowId, t.UInt64),
                arg(play.flowId, t.UInt64),
                arg(dto.name, t.String),
                arg(dto.maxMintSize ?? null, t.Optional(t.UInt64)),
                arg(dto.rarity, t.String),
                arg(toKeyValueArray(streamerNameToRoyalty), t.Dictionary({ key: t.String, value: t.UFix64 })),
            ],
        })

        if (tx.errorMessage) {
            throw new InternalServerErrorException(tx.errorMessage)
        }

        return { result: true }
    }

    /**
     * List all Editions with marketplace data
     */
    async findAll(args: EditionFindAllArgs): Promise<Edition[]> {

        const includePlay = !!args.include?.includes(EditionFindAllInclude.PLAY)
        const includeStreamer = !!args.include?.includes(EditionFindAllInclude.STREAMER)
        const isMarketPreset = args.preset === EditionPreset.MARKETPLACE

        const tEditions = await this.prisma.edition.findMany({
            include: {
                play: (includePlay || includeStreamer) && {
                    include: {
                        streamer: includeStreamer && {
                            select: {
                                id: true,
                                name: true,
                                user: { select: { avatar: true } },
                            },
                        },
                    },
                },
            },
            where: {
                play: {
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
                },
                nfts: {
                    some: {
                        AND: [
                            { lots: isMarketPreset ? { some: { buyerId: null } } : undefined },
                            { ownerID: args.ownerID ?? undefined },
                        ],
                    },
                },
            },
            skip: args.skip,
            take: args.take,
            orderBy: { createdAt: 'desc' },
        })

        const editions: Edition[] = []

        for (const tEdition of tEditions) {

            const play: any | undefined = tEdition.play
            if (includeStreamer && play?.streamer) {
                play['streamer'] = { ...play.streamer, avatar: play.streamer.user.avatar }
                tEdition['play'] = { ...play }
            }

            const marketplaceData = await this.marketDataService.getMarketplaceDataByEdition(tEdition.id)
            if (marketplaceData.lowestAsk) {
                if (args.minPrice && marketplaceData.lowestAsk.lt(args.minPrice)) {
                    continue
                }
                if (args.maxPrice && marketplaceData.lowestAsk.gt(args.maxPrice)) {
                    continue
                }
            }

            editions.push(
                plainToInstance(Edition, { ...tEdition, ...marketplaceData }),
            )
        }

        return editions
    }

    /**
     * Retrieve one Edition
     */
    async findOne(key: ConnectEditionDto, args: EditionFindOneArgs): Promise<Edition> {
        if (!checkOnlyOneAttr(key)) {
            throw new BadRequestException('Provide only one of the keys')
        }

        const includeStreamer = !!args.include?.includes(EditionFindOneInclude.STREAMER)
        const includeGame = !!args.include?.includes(EditionFindOneInclude.GAME)
        const includeTags = !!args.include?.includes(EditionFindOneInclude.TAGS)
        const includeNfts = !!args.include?.includes(EditionFindOneInclude.NFTS)
        const includeLots = !!args.include?.includes(EditionFindOneInclude.LOTS)
        const includePlay = !!args.include?.includes(EditionFindOneInclude.PLAY)

        const edition = await this.prisma.edition.findUniqueOrThrow({
            include: {
                play: (includePlay || includeGame || includeTags || includeStreamer) && {
                    include: {
                        game: includeGame,
                        tags: includeTags,
                        streamer: includeStreamer && {
                            select: {
                                id: true,
                                name: true,
                                user: { select: { avatar: true } },
                            },
                        },
                    },
                },
                nfts: (includeNfts || includeLots) && {
                    include: {
                        lots: includeLots && { orderBy: { createdAt: 'desc' } },
                    },
                },
            },
            where: key,
        })

        const play: any | undefined = edition.play
        if (includeStreamer && play?.streamer) {
            edition['play']['streamer'] = { ...play.streamer, avatar: play.streamer.user.avatar }
        }

        const marketplaceData = await this.marketDataService.getMarketplaceDataByEdition(edition.id)

        return plainToInstance(Edition, { ...edition, ...marketplaceData })
    }

    /**
     * Uses to create an Edition in DB when Graffle sends data from Flow chain via webhook
     */
    async createEdition(
        name: string,
        rarity: string,
        createdAt: Date,
        editionID: string,
        setID: string,
        playID: string,
        txId: string,
        maxMintSize?: string,
    ): Promise<void> {

        await this.prisma.edition.create({
            data: {
                flowId: editionID,
                flowSetId: setID,
                flowPlayId: playID,
                transactionId: txId,
                name: name,
                rarity: rarity,
                maxMintSize: maxMintSize,
                createdAt: createdAt,
                set: { connect: { flowId: setID } },
                play: { connect: { flowId: playID } },
            },
        })
    }

    /**
     * Uses to close the Edition in DB
     */
    async closeEdition(
        editionID: string,
    ): Promise<void> {

        const edition = await this.prisma.edition.findUniqueOrThrow({
            select: {
                _count: { select: { nfts: true } },
            },
            where: { flowId: editionID },
        })

        const numMinted = edition._count.nfts

        await this.prisma.edition.update({
            data: {
                maxMintSize: String(numMinted),
            },
            where: { flowId: editionID },
        })
    }

}
