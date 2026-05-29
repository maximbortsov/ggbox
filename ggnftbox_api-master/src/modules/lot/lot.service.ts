import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Lot } from './entities/lot.entity'
import { plainToInstance } from 'class-transformer'
import { LotFindAllArgs } from './args/lot-find-all.args'
import { LotInclude } from './args/lot.include'
import { LotFindOneArgs } from './args/lot-find-one.args'
import { MarketDataService } from '../play/market-data.service'
import { NftService } from '../nft/nft.service'


@Injectable()
export class LotService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly marketDataService: MarketDataService,
        private readonly nftService: NftService,
    ) {
    }

    /**
     * List all Lots
     */
    async findAll(args: LotFindAllArgs): Promise<Lot[]> {

        const includeNft = !!args.include?.includes(LotInclude.NFT)
        const includeBuyer = !!args.include?.includes(LotInclude.BUYER)
        const includeSeller = !!args.include?.includes(LotInclude.SELLER)
        const includeEdition = !!args.include?.includes(LotInclude.EDITION)
        const includePlay = !!args.include?.includes(LotInclude.PLAY)

        const tLots = await this.prisma.lot.findMany({
            include: {
                nft: (includeNft || includeEdition || includePlay) && {
                    include: {
                        edition: (includeEdition || includePlay) && {
                            include: { play: includePlay },
                        },
                    },
                },
                buyer: includeBuyer && {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        flowWallet: true,
                    },
                },
                seller: includeSeller && {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        flowWallet: true,
                    },
                },
            },
            where: {
                sellerId: args.ownerId,
                nft: { edition: { playId: args.playId } },
                buyerId: typeof args.open !== 'boolean' ? undefined : (args.open ? null : { not: null }),
            },
            skip: args.skip,
            take: args.take,
            orderBy: { createdAt: 'desc' },
        })

        const lots: Lot[] = []

        for (const lot of tLots) {
            if (includePlay) {
                const edition: any = (lot.nft as any).edition
                const play: any = edition.play
                const marketplaceData = await this.marketDataService.getMarketplaceDataByPlay(play.id)
                lot['nft']['edition']['play'] = { ...play, ...marketplaceData }
            }
            lots.push(plainToInstance(Lot, lot))
        }

        return lots
    }

    /**
     * Retrieve one Lot
     */
    async findOne(id: string, args: LotFindOneArgs): Promise<Lot> {

        const includeBuyer = !!args.include?.includes(LotInclude.BUYER)
        const includeSeller = !!args.include?.includes(LotInclude.SELLER)
        const includeNft = !!args.include?.includes(LotInclude.NFT)
        const includeEdition = !!args.include?.includes(LotInclude.EDITION)
        const includePlay = !!args.include?.includes(LotInclude.PLAY)

        const lot = await this.prisma.lot.findUniqueOrThrow({
            include: {
                nft: (includeNft || includeEdition || includePlay) && {
                    include: {
                        edition: (includeEdition || includePlay) && {
                            include: { play: includePlay },
                        },
                    },
                },
                buyer: includeBuyer && {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        flowWallet: true,
                    },
                },
                seller: includeSeller && {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        flowWallet: true,
                    },
                },
            },
            where: { id: id },
        })

        if (includePlay) {
            const edition: any = (lot.nft as any).edition
            const play: any = edition.play
            const marketplaceData = await this.marketDataService.getMarketplaceDataByPlay(play.id)
            lot['nft']['edition']['play'] = { ...play, ...marketplaceData }
        }

        return plainToInstance(Lot, lot)
    }

    /**
     * Uses to create a Lot in DB when Graffle sends data from Flow chain via webhook
     */
    async createLot(
        nftID: string,
        price: number,
        sellerAddress: string,
        createdAt: Date,
        transactionID: string,
    ): Promise<void> {
        await this.prisma.lot.create({
            data: {
                price: price,
                updatedAt: createdAt,
                createdAt: createdAt,
                transactionID: transactionID,
                flowNftId: nftID,
                nft: { connect: { flowID: nftID } },
                seller: { connect: { flowWallet: sellerAddress } },
            },
        })
    }

    /**
     * Uses to update the Lot in DB when someone bought the Lot via Flow chain
     */
    async updateLotToPurchased(
        nftID: string,
        price: string,
        buyerAddress: string,
        sellerAddress: string,
        soldAt: Date,
        transactionID: string,
    ): Promise<void> {
        const lot = await this.prisma.lot.findFirstOrThrow({
            where: {
                buyerId: null,
                nft: { flowID: nftID },
                seller: { flowWallet: sellerAddress },
            },
        })

        // Transfer NFT
        await this.nftService.detachOwner(nftID, sellerAddress)
        await this.nftService.attachOwner(nftID, buyerAddress)

        await this.prisma.lot.update({
            data: {
                price: price,
                soldAt: soldAt,
                updatedAt: soldAt,
                purchaseTransactionID: transactionID,
                buyer: { connect: { flowWallet: buyerAddress } },
            },
            where: { id: lot.id },
        })
    }

    /**
     * Uses to update the Lot price in DB
     */
    async updateLotPrice(
        nftID: string,
        newPrice: string,
        sellerAddress: string,
        updateAt: Date,
    ): Promise<void> {
        const lot = await this.prisma.lot.findFirstOrThrow({
            where: {
                buyerId: null,
                nft: { flowID: nftID },
                seller: { flowWallet: sellerAddress },
            },
        })

        await this.prisma.lot.update({
            data: {
                price: newPrice,
                updatedAt: updateAt,
            },
            where: { id: lot.id },
        })
    }

    /**
     * Uses to delete the Lot when the owner withdrawn the lot nft
     */
    async deleteLot(
        nftID: string,
        ownerAddress: string,
    ): Promise<void> {
        const lot = await this.prisma.lot.findFirstOrThrow({
            where: {
                buyerId: null,
                nft: { flowID: nftID },
                seller: { flowWallet: ownerAddress },
            },
        })
        await this.prisma.lot.delete({
            where: {
                id: lot.id,
            },
        })
    }

}
