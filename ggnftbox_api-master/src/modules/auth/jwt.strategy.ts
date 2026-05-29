import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from './auth.service'
import { JwtPayload } from './jwt-payload'
import { ConfigService } from '@nestjs/config'
import { SecurityConfig } from '../../config/config.interface'
import { User } from '../user/entities/user.entity'


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<SecurityConfig>('security')?.accessKey,
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        return this.authService.validateAuthUser(payload.id)
    }

}
