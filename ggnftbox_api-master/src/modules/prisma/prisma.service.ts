import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    async onModuleInit(): Promise<void> {
        await this.$connect()
    }

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect()
    }

    async enableShutdownHooks(app: INestApplication): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.$on('beforeExit', async (): Promise<void> => {
            await app.close()
        })
    }
}
