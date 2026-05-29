import { PrismaService } from '../prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'


type Nfts = Array<{ lots: Array<{ price: Prisma.Decimal; buyerId: string | null }> }>


export interface MarketplaceData {
    nftNumMinted: bigint
    topSale: Prisma.Decimal | null
    lowestAsk: Prisma.Decimal | null
}


@Injectable()
export class MarketDataService {

    constructor(
        private readonly prisma: PrismaService,
    ) {
    }

    /**
     * Form marketplace data from nfts
     */
    private static formMarketplaceData(nfts: Nfts): MarketplaceData {
        const nftNumMinted = BigInt(nfts.length)
        let lowestAsk: Prisma.Decimal | null = null
        let topSale: Prisma.Decimal | null = null
        for (const nft of nfts) {
            for (const lot of nft.lots) {
                const price = lot.price
                if (lot.buyerId === null && (lowestAsk === null || price.lte(lowestAsk))) {
                    lowestAsk = price
                }
                if (lot.buyerId !== null && (topSale === null || price.gte(topSale))) {
                    topSale = price
                }
            }
        }
        return {
            nftNumMinted: nftNumMinted,
            lowestAsk: lowestAsk,
            topSale: topSale,
        }
    }

    /**
     * Create marketplace data for one Play
     */
    public async getMarketplaceDataByPlay(playID: string): Promise<MarketplaceData> {
        const nfts: Nfts = await this.prisma.nft.findMany({
            select: {
                lots: {
                    select: { price: true, buyerId: true },
                },
            },
            where: { edition: { playId: playID } },
        })

        return MarketDataService.formMarketplaceData(nfts)
    }

    /**
     * Create marketplace data for one Edition
     */
    public async getMarketplaceDataByEdition(editionID: string): Promise<MarketplaceData> {
        const nfts: Nfts = await this.prisma.nft.findMany({
            select: {
                lots: {
                    select: { price: true, buyerId: true },
                },
            },
            where: { editionID: editionID },
        })

        return MarketDataService.formMarketplaceData(nfts)
    }
}
