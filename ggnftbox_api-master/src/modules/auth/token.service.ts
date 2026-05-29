import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtPayload } from './jwt-payload'
import { Token } from './entities/token.entity'
import { SecurityConfig } from '../../config/config.interface'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'


@Injectable()
export class TokenService {

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
    }

    generateTokens({ id, roles }: JwtPayload): Token {
        const accessToken = this.generateAccessToken({ id, roles })
        const refreshToken = this.generateRefreshToken({ id, roles })

        return { accessToken, refreshToken }
    }

    refreshToken(refreshToken: string): Token {
        const refreshSecret = this.configService.get<SecurityConfig>('security')?.refreshKey

        try {
            const payload = this.jwtService.verify(refreshToken, { secret: refreshSecret })
            return this.generateTokens(payload)
        } catch (err: unknown) {
            throw new BadRequestException('Invalid refresh token')
        }
    }

    private generateAccessToken(payload: JwtPayload): string {
        return this.jwtService.sign(payload)
    }

    private generateRefreshToken(payload: JwtPayload): string {
        const securityConfig = this.configService.get<SecurityConfig>('security')
        return this.jwtService.sign(payload, {
            secret: securityConfig?.refreshKey,
            expiresIn: securityConfig?.refreshIn,
        })
    }
}
