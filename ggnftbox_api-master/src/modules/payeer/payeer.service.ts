import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Payeer } from '../../shared/payeer'
import { PayeerConfig } from '../../config/config.interface'
import { Money } from 'ts-money'
import { PaymentLink } from './entity/payment-link.entity'
import { PaymentHookDto } from './dto/payment-hook.dto'
import { PrismaService } from '../prisma/prisma.service'
import { getRandom, getStandardizedMoney } from '../../shared/utils-function'
import { plainToInstance } from 'class-transformer'
import { PaymentStatus } from '../../shared/consts/payment-status'
import { BoxHelpers } from '../box/box-helpers'


@Injectable()
export class PayeerService {

    private readonly payeer: Payeer
    private readonly payeerConfig: PayeerConfig

    constructor(
        configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        this.payeerConfig = configService.getOrThrow<PayeerConfig>('payeer')

        this.payeer = new Payeer(this.payeerConfig.account, this.payeerConfig.apiId, this.payeerConfig.apiPass)
    }

    async getMerchantLink(orderId: string, amount: Money, desc?: string): Promise<PaymentLink> {
        const redirectUrl = this.payeerConfig.redirectUrl

        const params = {
            success_url: redirectUrl + 'true',
            fail_url: redirectUrl + 'false',
            status_url: this.payeerConfig.hookUrl,
        }

        const link = this.payeer.offlineMerchantLink(orderId, amount, this.payeerConfig.shopId, this.payeerConfig.shopKey, desc, params)

        if (!link) {
            throw new InternalServerErrorException('The payment (merchant) link has not been generated')
        }

        return plainToInstance(PaymentLink, { link: link })
    }

    static makeErrorResponse(orderId: string): string {
        return orderId + '|error'
    }

    static makeSuccessResponse(orderId: string): string {
        return orderId + '|success'
    }

    async getBoxPaymentLink(userId: string, boxId: string): Promise<PaymentLink> {
        // Create Payeer payment link for box purchase operation
        const { name, price } = await this.prisma.box.findUniqueOrThrow({
            select: { name: true, price: true },
            where: { id: boxId },
        })

        const token = await this.prisma.paymentToken.create({
            data: {
                userId: userId,
                boxId: boxId,
            },
        })

        const desc = `Payment for the "${name}" box`
        const money = getStandardizedMoney(price)
        return this.getMerchantLink(token.id, money, desc)
    }

    async consume(hookBody: PaymentHookDto): Promise<string> {
        const data = this.payeer.parsePaymentCallback(hookBody, this.payeerConfig.shopKey)

        const token = await this.prisma.paymentToken.findUnique({
            select: {
                id: true,
                userId: true,
                boxId: true,
            },
            where: { id: data.orderId },
        })

        if (!token) {
            return PayeerService.makeErrorResponse(data.orderId)
        }
        await this.prisma.paymentToken.delete({ where: { id: data.orderId } })

        if (!token.boxId || !data.success) {
            return PayeerService.makeErrorResponse(data.orderId)
        }

        try {
            const box = await this.prisma.box.findUniqueOrThrow({
                select: {
                    id: true,
                    price: true,
                    size: true,
                    nfts: {
                        select: { id: true },
                        where: {
                            ownerID: null,
                            boxTokenID: null,
                        },
                    },
                },
                where: { id: token.boxId },
            })

            // Check count of boxes in stock and count of NFTs to transfer
            const inStock = await BoxHelpers.getInStock(box, this.prisma)
            if (inStock === 0 || box.nfts.length < box.size) {
                return PayeerService.makeErrorResponse(data.orderId)
            }

            // Get NFT ids
            const ids = getRandom(box.nfts, box.size).map((x) => x.id)

            await this.prisma.$transaction(async (prisma): Promise<void> => {
                    await prisma.payment.create({
                        data: {
                            amount: data.amountPaid.toDecimal(),
                            status: PaymentStatus.SUCCESS,
                            userId: token.userId,
                            boxId: box.id,
                        },
                    })
                    const boxToken = await prisma.boxToken.create({
                        data: {
                            userID: token.userId,
                            boxID: box.id,
                        },
                    })
                    const { count } = await prisma.nft.updateMany({
                        data: { boxTokenID: boxToken.id },
                        where: { id: { in: ids } },
                    })
                    if (count != ids.length) {
                        throw new InternalServerErrorException('Something wrong in box determination')
                    }
                },
            )
            return PayeerService.makeSuccessResponse(data.orderId)
        } catch (e) {
            return PayeerService.makeErrorResponse(data.orderId)
        }
    }

}
