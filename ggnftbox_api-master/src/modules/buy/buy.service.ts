import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PayeerService } from '../payeer/payeer.service'
import { PaymentLink } from '../payeer/entity/payment-link.entity'
import { BoxHelpers } from '../box/box-helpers'


@Injectable()
export class BuyService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly payeerService: PayeerService,
    ) {
    }

    async createBoxPayment(userId: string, boxId: string): Promise<PaymentLink> {

        await this.checkBoxToPay(boxId)

        return this.payeerService.getBoxPaymentLink(userId, boxId)
    }

    private async checkBoxToPay(boxId: string): Promise<void> {

        const box = await this.prisma.box.findUniqueOrThrow({
            select: {
                id: true,
                size: true,
                nfts: {
                    select: { id: true },
                    where: {
                        ownerID: null,
                        boxTokenID: null,
                    },
                },
            },
            where: { id: boxId },
        })

        const inStock = await BoxHelpers.getInStock(box, this.prisma)

        if (inStock === 0) {
            throw new BadRequestException('All these boxes are sold out')
        }
        if (box.nfts.length < box.size) {
            throw new BadRequestException('Not enough NFTs')
        }
    }

}
