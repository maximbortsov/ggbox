import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { User } from '../user/entities/user.entity'
import { FlowNonce } from './entities/flow-nonce.entity'
import { randomBytes } from 'crypto'
import { plainToInstance } from 'class-transformer'
import * as fcl from '@onflow/fcl'
import { Cache } from 'cache-manager'
import { ConfigService } from '@nestjs/config'
import { FlowConfig } from '../../config/config.interface'
import { FlowAccProofDto } from './dto/flow-acc-proof.dto'
import { Token } from './entities/token.entity'
import { TokenService } from './token.service'
import { Roles } from '../../config/roles'


@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {
    }

    async validateAuthUser(id: string): Promise<User> {
        return this.userService.findOne({ id })
    }

    async generateNonce(): Promise<FlowNonce> {
        const nonce = randomBytes(32).toString('hex')
        await this.cacheManager.set(nonce, true)
        return plainToInstance(FlowNonce, { nonce })
    }

    async loginOrRegister(data: FlowAccProofDto): Promise<Token> {
        const verified = await this.verifyFlowAcc(data)
        if (!verified) {
            throw new UnauthorizedException('Invalid account')
        }

        const flowWallet = data.address
        const userExisted = await this.userService.exists({ flowWallet })
        if (userExisted) {
            return this.login(flowWallet)
        } else {
            return this.register(flowWallet)
        }
    }

    private async verifyFlowAcc(data: FlowAccProofDto): Promise<boolean> {
        // Check nonce
        const nonce = data.nonce
        const isNonceExisted = !!await this.cacheManager.get<boolean>(nonce)
        if (!isNonceExisted) {
            return false
        }
        // Remove nonce
        await this.cacheManager.del(nonce)

        // Verify Flow account
        const appId = this.configService.getOrThrow<FlowConfig>('flow').identifier
        return fcl.AppUtils.verifyAccountProof(appId, data)
    }

    private async login(flowWallet: string): Promise<Token> {
        const user = await this.userService.findOne({ flowWallet })
        return this.tokenService.generateTokens({ id: user.id, roles: user.roles })
    }

    private async register(flowWallet: string): Promise<Token> {
        const user = await this.userService.create({
            data: {
                flowWallet: flowWallet,
                username: flowWallet,
                roles: [Roles.USER],
            },
        })
        return this.tokenService.generateTokens({ id: user.id, roles: user.roles })
    }

}
