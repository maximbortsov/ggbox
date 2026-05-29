import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { GameModule } from './modules/game/game.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { ThrottlerBehindProxyGuard } from './shared/guards/throttler-behind-proxy.guard'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { TagModule } from './modules/tag/tag.module'
import { AgreementModule } from './modules/agreement/agreement.module'
import config from './config/config'
import { AccessControlModule } from 'nest-access-control'
import { roles } from './config/roles'
import { StreamerModule } from './modules/streamer/streamer.module'
import { BoxModule } from './modules/box/box.module'
import { NftModule } from './modules/nft/nft.module'
import { LotModule } from './modules/lot/lot.module'
import { LocalFileModule } from './modules/local-file/local-file.module'
import { PrismaKnownExceptionFilter } from './shared/filters/prisma-known-exception.filter'
import { BuyModule } from './modules/buy/buy.module'
import { PinataModule } from './modules/pinata/pinata.module'
import { GraffleReceiverModule } from './modules/graffle-receiver/graffle-receiver.module'
import { PlayModule } from './modules/play/play.module'
import { SetModule } from './modules/set/set.module'
import { EditionModule } from './modules/edition/edition.module'
import { PayeerModule } from './modules/payeer/payeer.module'
import { AppLoggerMiddleware } from './shared/app-logger-middleware'
import { BoxTokenModule } from './modules/box-token/box-token.module'
import { PrismaModule } from './modules/prisma/prisma.module'


@Module({
    imports: [
        // TODO|| Cache to true for production
        ConfigModule.forRoot({ isGlobal: true, cache: false, load: [config] }),
        ThrottlerModule.forRoot({ ttl: 60, limit: 60 }),
        AccessControlModule.forRoles(roles),
        PrismaModule.forRoot({
            isGlobal: true,
            prismaServiceOptions: {
                prismaOptions: {
                    log: ['warn', 'error'],
                },
                explicitConnect: false,
            },
        }),
        // Modules w/o imports
        LocalFileModule,
        BoxTokenModule,
        PinataModule,
        TagModule,
        AgreementModule,
        PayeerModule,
        // Modules w/ imports and exports
        UserModule,
        GameModule,
        StreamerModule,
        BoxModule,
        PlayModule,
        SetModule,
        EditionModule,
        // Modules w/ imports and w/o exports
        LotModule,
        NftModule,
        BuyModule,
        AuthModule,
        GraffleReceiverModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerBehindProxyGuard,
        },
        {
            provide: APP_FILTER,
            useClass: PrismaKnownExceptionFilter,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*')
    }
}
