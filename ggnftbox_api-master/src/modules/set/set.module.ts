import { Module } from '@nestjs/common'
import { SetService } from './set.service'
import { SetController } from './set.controller'
import { PlayModule } from '../play/play.module'


@Module({
    imports: [PlayModule],
    controllers: [SetController],
    providers: [SetService],
    exports: [SetService],
})
export class SetModule {
}
