import { Module } from '@nestjs/common'
import { LotService } from './lot.service'
import { LotController } from './lot.controller'
import { PlayModule } from '../play/play.module'
import { NftModule } from '../nft/nft.module'


@Module({
    imports: [PlayModule, NftModule],
    controllers: [LotController],
    providers: [LotService],
    exports: [LotService],
})
export class LotModule {
}
