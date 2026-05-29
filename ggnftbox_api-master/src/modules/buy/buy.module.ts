import { Module } from '@nestjs/common'
import { BuyService } from './buy.service'
import { BuyController } from './buy.controller'
import { BoxModule } from '../box/box.module'
import { PayeerModule } from '../payeer/payeer.module'


@Module({
    imports: [BoxModule, PayeerModule],
    controllers: [BuyController],
    providers: [BuyService],
})
export class BuyModule {
}
