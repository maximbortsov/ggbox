import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import ResponseBoolean from '../../shared/response-boolean'
import { plainToInstance } from 'class-transformer'
import { GGSet } from './entities/gg-set.entity'
import { ConnectSetDto } from './dto/connect-set.dto'
import { checkOnlyOneAttr } from '../../shared/utils-function'
import { sendFlowTx } from '../../shared/fcl-wrapper'


@Injectable()
export class SetService {

    constructor(
        private readonly prisma: PrismaService,
    ) {
    }

    /**
     * Create Set via Flow transaction
     */
    async sendToCreate(name: string): Promise<ResponseBoolean> {

        const tx = await sendFlowTx({
            pathTx: 'admin/sets/create_set',
            args: (arg, t) => [
                arg(name, t.String),
            ],
        })

        if (tx.errorMessage) {
            throw new InternalServerErrorException(tx.errorMessage)
        }

        return { result: true }
    }

    /**
     * Retrieve one Set
     */
    async findOne(key: ConnectSetDto): Promise<GGSet> {

        if (!checkOnlyOneAttr(key)) {
            throw new BadRequestException('Provide only one of the keys')
        }

        const set = await this.prisma.set.findUniqueOrThrow({
            where: key,
        })

        return plainToInstance(GGSet, set, { excludeExtraneousValues: true })
    }

    /**
     * Uses to create a Set in DB when Graffle sends data from Flow chain via webhook
     */
    async createSet(
        name: string,
        createdAt: Date,
        flowId: string,
        txId: string,
    ): Promise<void> {

        await this.prisma.set.create({
            data: {
                name: name,
                flowId: flowId,
                createdAt: createdAt,
                transactionId: txId,
            },
        })
    }

    /**
     * Uses to add Play to Set in DB when Graffle sends data from Flow chain via webhook
     */
    async addPlayToSet(
        setID: string,
        playID: string,
    ): Promise<void> {

        const set = await this.prisma.set.findUnique({ select: { setPlaysInEditions: true }, where: { flowId: setID } })
        const plays = set?.setPlaysInEditions ?? {}
        plays[playID] = true

        await this.prisma.set.update({
            data: {
                setPlaysInEditions: plays,
                plays: {
                    connect: { flowId: playID },
                },
            },
            where: { flowId: setID },
        })

    }
}
