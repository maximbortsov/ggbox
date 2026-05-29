import {
    CACHE_MANAGER,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { GraffleConfig } from '../../config/config.interface'
import { Cache } from 'cache-manager'
import removeIndentation from 'remove-indentation'
import * as crypto from 'node:crypto'
import { getFullURL } from '../../shared/utils-function'
import { isNumberString } from 'class-validator'


@Injectable()
export class GraffleHmacGuard implements CanActivate {

    private readonly graffleConfig: GraffleConfig

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        configService: ConfigService,
    ) {
        this.graffleConfig = configService.getOrThrow<GraffleConfig>('graffle')
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        const auth = request.headers.authorization

        console.log(auth)

        if (!auth) {
            throw new UnauthorizedException()
        }

        return this.verifyHmac(auth, request)
    }

    async verifyHmac(hmacauth: string, req: Request): Promise<boolean> {
        // Cut 'hmacauth '
        hmacauth = hmacauth.slice(9)

        // companyId:base64RequestSignature:nonce:requestTimestamp
        const headerParts = hmacauth.split(':')
        const base64RequestSignature = headerParts[1]
        const nonce = headerParts[2] ?? ''
        const requestTimestamp = isNumberString(headerParts[3], { no_symbols: true }) ? Number(headerParts[3]) : 0

        let body = removeIndentation(req.body.toString(), 0)
            .replace(/\r?\n|\r/g, '')
            .replace(/":\s/g, '":')
        const secret = Buffer.from(this.graffleConfig.base64Secret, 'base64').toString('utf8')
        let url = getFullURL(req)

        // Verify company ID, nonce and timestamp
        if (headerParts[0] != this.graffleConfig.companyId) {
            throw new ForbiddenException()
        }
        if (await this.isReplayRequest(nonce, requestTimestamp)) {
            throw new ForbiddenException('Replay request')
        }

        // Compute hmacsha256
        url = encodeURIComponent(url).toLowerCase()
        body = decodeURIComponent(encodeURIComponent(body))

        const md5Body = crypto.createHash('md5').update(body).digest('base64')

        let dataToHash = `${this.graffleConfig.companyId}${req.method}${url}${requestTimestamp}${nonce}${md5Body}`
        dataToHash = decodeURIComponent(encodeURIComponent(dataToHash))

        const base64GeneratedSignature = crypto
            .createHmac('sha256', secret)
            .update(dataToHash)
            .digest('base64')

        return base64GeneratedSignature == base64RequestSignature
    }

    private async isReplayRequest(nonce: string, requestTimestamp: number): Promise<boolean> {
        if (await this.cacheManager.get<boolean>(nonce)) {
            return true
        }
        const now = Math.floor(Date.now() / 1000)
        const tenMin = 10 * 60
        if ((now - requestTimestamp) > tenMin) {
            return true
        }
        await this.cacheManager.set(nonce, true)
        return false
    }
}
