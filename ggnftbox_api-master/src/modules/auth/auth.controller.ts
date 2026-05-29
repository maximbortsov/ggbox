import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { RefreshDto } from './dto/refresh.dto'
import { Token } from './entities/token.entity'
import { TokenService } from './token.service'
import { FlowNonce } from './entities/flow-nonce.entity'
import { FlowAccProofDto } from './dto/flow-acc-proof.dto'


@Controller('auth')
@ApiTags('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
    ) {
    }

    @Post('gen-nonce')
    @ApiOkResponse({ type: FlowNonce })
    async generate(): Promise<FlowNonce> {
        return this.authService.generateNonce()
    }

    @Post('login')
    @ApiOkResponse({ type: Token })
    async loginOrRegister(@Body() data: FlowAccProofDto): Promise<Token> {
        return this.authService.loginOrRegister(data)
    }

    @Post('refresh')
    @ApiOkResponse({ type: Token })
    refreshToken(@Body() { refreshToken }: RefreshDto): Token {
        return this.tokenService.refreshToken(refreshToken)
    }

}
