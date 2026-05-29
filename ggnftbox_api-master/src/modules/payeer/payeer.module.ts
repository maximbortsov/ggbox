import { Module } from '@nestjs/common'
import { PayeerService } from './payeer.service'
import { PayeerController } from './payeer.controller'


@Module({
    controllers: [PayeerController],
    providers: [PayeerService],
    exports: [PayeerService],
})
export class PayeerModule {
}
