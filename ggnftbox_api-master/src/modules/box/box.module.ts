import { Module } from '@nestjs/common'
import { BoxService } from './box.service'
import { BoxController } from './box.controller'
import { LocalFileModule } from '../local-file/local-file.module'


@Module({
    imports: [LocalFileModule],
    controllers: [BoxController],
    providers: [BoxService],
    exports: [BoxService],
})
export class BoxModule {
}
