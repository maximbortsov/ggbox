import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { LocalFileService } from '../local-file/local-file.service'
import { plainToInstance } from 'class-transformer'
import { UpdateUserDto } from './dto/update-user.dto'
import { TypeTransaction, UserTransaction } from './entities/user-transaction.entity'
import { checkOnlyOneAttr } from '../../shared/utils-function'
import { ConnectUserDto } from './dto/connect-user.dto'


@Injectable()
export class UserService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly localFileService: LocalFileService,
    ) {
    }

    /**
     * Check if the User exists
     */
    async exists(key: ConnectUserDto): Promise<boolean> {
        if (!checkOnlyOneAttr(key)) {
            throw Error('Provide only one of the keys')
        }
        return !!(await this.prisma.user.findUnique({
            where: {
                id: key.id,
                username: key.username,
                flowWallet: key.flowWallet,
            },
        }))
    }

    async create({ data, file }: CreateUserDto): Promise<User> {
        return this.prisma.$transaction(async (prisma): Promise<User> => {
            let user = await prisma.user.create({
                data: {
                    username: data.username,
                    roles: data.roles,
                    flowWallet: data.flowWallet,
                },
            })

            if (file) {
                const toFile = await this.localFileService.saveUserAvatar(file.buffer, user.id)
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { avatar: toFile },
                })
            }
            return plainToInstance(User, user)
        })
    }

    async findAll(): Promise<User[]> {
        return plainToInstance(User, await this.prisma.user.findMany())
    }

    async findOne(key: ConnectUserDto): Promise<User> {
        if (!checkOnlyOneAttr(key)) {
            throw Error('Provide only one of the keys')
        }
        return plainToInstance(User, await this.prisma.user.findUniqueOrThrow({ where: key }))
    }

    async update(id: string, { data, file }: UpdateUserDto): Promise<User> {
        let toFile: string | null | undefined

        return await this.prisma.$transaction(async (prisma): Promise<User> => {
            const { avatar } = await prisma.user.update({
                select: { avatar: true },
                data: {
                    username: data.username,
                    flowWallet: data.flowWallet,
                },
                where: { id: id },
            })

            if (file) {
                toFile = await this.localFileService.saveUserAvatar(file.buffer, id)
            } else if (file === null && avatar) {
                await this.localFileService.removeFile(avatar)
                toFile = null
            }

            const user = await prisma.user.update({
                where: { id: id },
                data: { avatar: toFile },
            })

            return plainToInstance(User, user)
        })
    }

    async getAllTransactions(userId: string): Promise<UserTransaction[]> {

        const lots = await this.prisma.lot.findMany({
            select: { price: true, updatedAt: true },
            where: { buyerId: userId },
        })

        const payments = await this.prisma.payment.findMany({
            select: { amount: true, updatedAt: true },
            where: { userId: userId, boxId: { not: null } },
        })

        let transactions: UserTransaction[] = []

        for (const lot of lots) {
            const row = {
                type: TypeTransaction.BUY_LOT,
                amount: lot.price,
                date: lot.updatedAt,
            }
            transactions.push(
                plainToInstance(UserTransaction, row),
            )
        }
        for (const payment of payments) {
            const row = {
                type: TypeTransaction.BUY_BOX,
                amount: payment.amount,
                date: payment.updatedAt,
            }
            transactions.push(
                plainToInstance(UserTransaction, row),
            )
        }
        transactions = transactions.sort((a, b) => Number(b.date) - Number(a.date))

        return plainToInstance(UserTransaction, transactions)
    }

}
