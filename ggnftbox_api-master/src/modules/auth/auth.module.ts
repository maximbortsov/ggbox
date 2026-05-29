import { CacheModule, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { ConfigService } from '@nestjs/config'
import { SecurityConfig } from '../../config/config.interface'
import { TokenService } from './token.service'
import { UserModule } from '../user/user.module'


@Module({
    imports: [
        CacheModule.register({ ttl: 120 }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<SecurityConfig>('security')?.accessKey,
                signOptions: {
                    expiresIn: configService.get<SecurityConfig>('security')?.expiresIn,
                },
            }),
        }),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, TokenService, JwtStrategy],
})
export class AuthModule {
}
