import { Module } from '@nestjs/common'
import { StreamerService } from './streamer.service'
import { StreamerController } from './streamer.controller'
import { UserModule } from '../user/user.module'


@Module({
    imports: [UserModule],
    controllers: [StreamerController],
    providers: [StreamerService],
    exports: [StreamerService],
})
export class StreamerModule {
}
