import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { LocalFileModule } from '../local-file/local-file.module'


@Module({

    imports: [LocalFileModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {
}
