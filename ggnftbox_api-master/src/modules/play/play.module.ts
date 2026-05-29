import { Module } from '@nestjs/common'
import { PlayService } from './play.service'
import { PlayController } from './play.controller'
import { StreamerModule } from '../streamer/streamer.module'
import { PinataModule } from '../pinata/pinata.module'
import { LocalFileModule } from '../local-file/local-file.module'
import { GameModule } from '../game/game.module'
import { MarketDataService } from './market-data.service'


@Module({
    imports: [PinataModule, LocalFileModule, GameModule, StreamerModule],
    controllers: [PlayController],
    providers: [PlayService, MarketDataService],
    exports: [PlayService, MarketDataService],
})
export class PlayModule {
}
