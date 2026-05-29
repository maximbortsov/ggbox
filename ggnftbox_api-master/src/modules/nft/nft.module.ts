import { Module } from '@nestjs/common'
import { NftService } from './nft.service'
import { NftController } from './nft.controller'
import { PlayModule } from '../play/play.module'
import { EditionModule } from '../edition/edition.module'


@Module({
    imports: [PlayModule, EditionModule],
    controllers: [NftController],
    providers: [NftService],
    exports: [NftService],
})
export class NftModule {
}
