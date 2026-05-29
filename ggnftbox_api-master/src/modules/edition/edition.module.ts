import { Module } from '@nestjs/common'
import { EditionService } from './edition.service'
import { EditionController } from './edition.controller'
import { PlayModule } from '../play/play.module'
import { SetModule } from '../set/set.module'
import { StreamerRoyaltyService } from './streamer-royalty.service'
import { StreamerModule } from '../streamer/streamer.module'


@Module({
    imports: [PlayModule, SetModule, StreamerModule],
    controllers: [EditionController],
    providers: [EditionService, StreamerRoyaltyService],
    exports: [EditionService],
})
export class EditionModule {
}
