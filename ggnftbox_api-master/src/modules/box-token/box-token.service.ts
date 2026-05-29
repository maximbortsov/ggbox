import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { plainToInstance } from 'class-transformer'
import { BoxToken } from './entities/box-token.entity'
import { BoxTokenFindAllArgs } from './args/box-token-find-all.args'
import { BoxTokenInclude } from './args/box-token.include'
import { Nft } from '../nft/entities/nft.entity'
import { sendFlowTx } from '../../shared/fcl-wrapper'
import { BoxHelpers } from '../box/box-helpers'


@Injectable()
export class BoxTokenService {

    constructor(
        private readonly prisma: PrismaService,
    ) {
    }

    async findAll(userId: string, args: BoxTokenFindAllArgs): Promise<BoxToken[]> {

        const includeBox = !!args.include?.includes(BoxTokenInclude.BOX)
        const includeStreamers = !!args.include?.includes(BoxTokenInclude.STREAMERS)
        const includeGames = !!args.include?.includes(BoxTokenInclude.GAMES)
        const includeTags = !!args.include?.includes(BoxTokenInclude.TAGS)

        const tBoxTokens = await this.prisma.boxToken.findMany({
            select: {
                id: true,
                boxID: true,
                createdAt: true,
                isOpen: true,
                box: (includeBox || includeTags || includeStreamers || includeGames) && {
                    include: {
                        tags: includeTags,
                        nfts: (includeStreamers || includeGames) && {
                            select: {
                                edition: {
                                    select: {
                                        play: {
                                            select: {
                                                streamer: includeStreamers && {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                        user: { select: { avatar: true } },
                                                    },
                                                },
                                                game: includeGames,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                userID: userId,
                isOpen: typeof args.open === 'boolean' ? args.open : undefined,
            },
            orderBy: { createdAt: 'desc' },
        })

        const tokens: BoxToken[] = []

        for (const tBoxToken of tBoxTokens) {
            const box = tBoxToken['box']
            if (includeStreamers) {
                tBoxToken['box']['streamers'] = BoxHelpers.getStreamersFrom(box)
            }
            if (includeGames) {
                tBoxToken['box']['games'] = BoxHelpers.getGamesFrom(box)
            }
            tokens.push(plainToInstance(BoxToken, tBoxToken))
        }

        return plainToInstance(BoxToken, tokens)
    }

    async openBox(boxTokenId: string, ownerId: string): Promise<Nft[]> {

        const { flowWallet } = await this.prisma.user.findUniqueOrThrow({
            select: { flowWallet: true },
            where: { id: ownerId },
        })

        if (!flowWallet) {
            throw new InternalServerErrorException('No Flow wallet for that user')
        }

        const selectedNfts = await this.prisma.nft.findMany({
            include: {
                edition: {
                    include: {
                        play: {
                            include: {
                                streamer: true,
                                game: true,
                                tags: true,
                            },
                        },
                    },
                },
            },
            where: {
                boxTokenID: boxTokenId,
                ownerID: null,
            },
        })
        // Get NFT ids
        const flowNftIds = selectedNfts.map((nft) => nft.flowID.toString())
        console.log(flowNftIds)

        return this.prisma.$transaction(async (prisma): Promise<Nft[]> => {

            const token = await prisma.boxToken.update({
                select: { id: true, box: { select: { size: true } } },
                data: { isOpen: true },
                where: { id: boxTokenId },
            })

            if (selectedNfts.length != token.box.size) {
                throw new InternalServerErrorException(`Not enough NFTs to open, ID: ${token.id}`)
            }

            // Send NFTs
            const tx = await sendFlowTx({
                pathTx: 'admin/fulfill_box',
                args: (arg, t) => [
                    arg(flowWallet, t.Address),
                    arg(flowNftIds, t.Array(t.UInt64)),
                ],
            })

            if (tx.errorMessage) {
                throw new InternalServerErrorException(tx.errorMessage)
            }

            return plainToInstance(Nft, selectedNfts)
        }, { maxWait: 60000, timeout: 120000 })
    }
}
