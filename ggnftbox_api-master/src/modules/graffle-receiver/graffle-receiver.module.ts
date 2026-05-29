import { CacheModule, Module } from '@nestjs/common'
import { GraffleReceiverController } from './graffle-receiver.controller'
import { PlayModule } from '../play/play.module'
import { SetModule } from '../set/set.module'
import { EditionModule } from '../edition/edition.module'
import { NftModule } from '../nft/nft.module'
import { LotModule } from '../lot/lot.module'


@Module({
    imports: [
        CacheModule.register(),
        PlayModule,
        SetModule,
        EditionModule,
        NftModule,
        LotModule,
    ],
    controllers: [GraffleReceiverController],
})
export class GraffleReceiverModule {
}
