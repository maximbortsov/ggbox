import { Module } from '@nestjs/common'
import { BoxTokenService } from './box-token.service'
import { BoxTokenController } from './box-token.controller'


@Module({
    controllers: [BoxTokenController],
    providers: [BoxTokenService],
    exports: [BoxTokenService],
})
export class BoxTokenModule {
}
