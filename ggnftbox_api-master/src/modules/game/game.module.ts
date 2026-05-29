import { Module } from '@nestjs/common'
import { GameService } from './game.service'
import { GameController } from './game.controller'
import { LocalFileModule } from '../local-file/local-file.module'


@Module({
    imports: [LocalFileModule],
    controllers: [GameController],
    providers: [GameService],
    exports: [GameService],
})
export class GameModule {
}
