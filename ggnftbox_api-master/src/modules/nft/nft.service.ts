import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Nft } from './entities/nft.entity'
import { NftFindAllArgs } from './args/nft-find-all.args'
import { plainToInstance } from 'class-transformer'
import ResponseBoolean from '../../shared/response-boolean'
import { checkOnlyOneAttr, toKeyValueArray } from '../../shared/utils-function'
import { CreateNftDto } from './dto/create-nft.dto'
import { EditionService } from '../edition/edition.service'
import * as fcl from '@onflow/fcl'
import { ConfigService } from '@nestjs/config'
import { FlowConfig } from '../../config/config.interface'
import { ConnectNftDto } from './dto/connect-nft.dto'
import { NftInclude } from './args/nft.include'
import { MarketDataService } from '../play/market-data.service'
import { sendFlowTx } from '../../shared/fcl-wrapper'
import { NftPreset } from './args/nft.preset'


@Injectable()
export class NftService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly editionService: EditionService,
        private readonly marketDataService: MarketDataService,
    ) {
    }

    /**
     * Create NFT via Flow transaction
     */
    async sendToCreate(dto: CreateNftDto): Promise<ResponseBoolean> {
        const flowConfig = this.configService.getOrThrow<FlowConfig>('flow')

        const edition = await this.editionService.findOne(dto.edition.connect, {})

        const tx = await sendFlowTx({
            pathTx: 'admin/nfts/mint_nft',
            args: (arg, t) => [
                arg(flowConfig.admin.address, t.Address),
                arg(edition.flowId, t.UInt64),
                arg(toKeyValueArray(dto.metadata), t.Dictionary({ key: t.String, value: t.String })),
            ],
        })

        if (tx.errorMessage) {
            throw new InternalServerErrorException(tx.errorMessage)
        }

        return { result: true }
    }

    async findAll(args: NftFindAllArgs): Promise<Nft[]> {

        const includeStreamer = !!args.include?.includes(NftInclude.STREAMER)
        const includeEdition = !!args.include?.includes(NftInclude.EDITION)
        const includePlay = !!args.include?.includes(NftInclude.PLAY)
        const includeOwner = !!args.include?.includes(NftInclude.OWNER)
        const includeLots = !!args.include?.includes(NftInclude.LOTS)

        const onSalePreset = args.preset === NftPreset.ON_SALE
        const notSalePreset = args.preset === NftPreset.NOT_SALE
        const onSale = onSalePreset ? true : (notSalePreset ? false : null)

        const tNfts = await this.prisma.nft.findMany({
            include: {
                edition: (includeEdition || includePlay || includeStreamer) && {
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
                },
                owner: includeOwner && {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        flowWallet: true,
                    },
                },
                lots: includeLots && {
                    where: {
                        buyerId: onSale === true ? null : (onSale === false ? { not: null } : undefined),
                    },
                },
            },
            where: {
                ownerID: args.ownerID,
                edition: { playId: args.playID },
                lots: typeof onSale !== 'boolean' ? undefined : {
                    [onSale ? 'some' : 'none']: {
                        buyerId: null,
                    },
                },
            },
            skip: args.skip,
            take: args.take,
            orderBy: [
                { mintingDate: 'desc' },
                { serialNumber: 'asc' },
            ],
        })

        const nfts: Nft[] = []

        for (const nft of (tNfts as any[])) {
            if (includePlay || includeStreamer) {
                const play = nft.edition.play
                const marketplaceData = await this.marketDataService.getMarketplaceDataByPlay(play.id)

                if (includeStreamer && play.streamer) {
                    play['streamer'] = { ...play.streamer, avatar: play.streamer.user.avatar }
                }

                nft['edition']['play'] = { ...play, ...marketplaceData }
            }
            nfts.push(plainToInstance(Nft, nft))
        }

        return nfts
    }

    async findOne(key: ConnectNftDto): Promise<Nft> {
        if (!checkOnlyOneAttr(key)) {
            throw Error('Provide only one of the keys')
        }
        const nft = await this.prisma.nft.findUniqueOrThrow({ where: key })
        return plainToInstance(Nft, nft)
    }

    /**
     * Uses to create a NFT in DB when Graffle sends data from Flow chain via webhook
     */
    async createNft(
        nftID: string,
        editionID: string,
        serialNumber: string,
        mintingDate: Date,
        metadata: Record<string, any>,
        transactionID: string,
    ): Promise<void> {

        await this.prisma.nft.create({
            data: {
                flowID: nftID,
                flowEditionID: editionID,
                serialNumber: serialNumber,
                mintingDate: mintingDate,
                metadata: metadata,
                transactionID: transactionID,
                edition: { connect: { flowId: editionID } },
            },
        })
    }

    /**
     * Uses to attach the owner to the NFT in DB
     */
    async attachOwner(
        nftID: string,
        newOwnerAddress: string,
    ): Promise<void> {

        let adminStorageNftAddr = this.configService.getOrThrow<FlowConfig>('flow').admin.address
        adminStorageNftAddr = fcl.withPrefix(adminStorageNftAddr)
        newOwnerAddress = fcl.withPrefix(newOwnerAddress)

        const isAdmin = adminStorageNftAddr == newOwnerAddress

        await this.prisma.nft.update({
            data: {
                ...(
                    isAdmin ?
                        { ownerID: null }
                        :
                        { owner: { connect: { flowWallet: newOwnerAddress } } }
                ),
            },
            where: { flowID: nftID },
        })
    }

    /**
     * Uses to detach the owner of the NFT in DB
     */
    async detachOwner(
        nftID: string,
        oldOwnerAddress: string,
    ): Promise<void> {

        const nft = await this.prisma.nft.findFirst({
            select: { id: true },
            where: { flowID: nftID, owner: { flowWallet: oldOwnerAddress } },
        })
        if (!nft) {
            Logger.log(`NFT already detach owner: ${oldOwnerAddress}, NFT Flow ID: ${nftID}`)
            return
        }

        await this.prisma.nft.update({
            data: { ownerID: null },
            where: { id: nft.id },
        })
    }
}
