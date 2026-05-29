import { Controller, Get, Post, Query } from '@nestjs/common'
import { BoxTokenService } from './box-token.service'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { BoxTokenFindAllArgs } from './args/box-token-find-all.args'
import { BoxToken } from './entities/box-token.entity'
import { ACAuth } from '../../shared/decorators/auth/ac-auth.decorator'
import { AppResources } from '../../config/roles'
import { AuthUser } from '../../shared/decorators/auth/auth-user.decorator'
import { User } from '../user/entities/user.entity'
import { Nft } from '../nft/entities/nft.entity'
import { ParamUUID } from '../../shared/decorators/param-uuid'
import { Throttle } from '@nestjs/throttler'


@ApiTags('box-token')
@Controller('box-token')
export class BoxTokenController {

    constructor(
        private readonly boxTokenService: BoxTokenService,
    ) {
    }

    @Throttle(1, 10)
    @Post('open/:id')
    @ACAuth(AppResources.BOX_TOKEN, 'update', 'own')
    @ApiCreatedResponse({ type: [Nft] })
    async open(@ParamUUID('id') boxId: string, @AuthUser() user: User): Promise<Nft[]> {
        return this.boxTokenService.openBox(boxId, user.id)
    }

    @Get()
    @ACAuth(AppResources.BOX_TOKEN, 'read', 'own')
    @ApiOkResponse({ type: [BoxToken] })
    async findAll(@AuthUser() user: User, @Query() args: BoxTokenFindAllArgs): Promise<BoxToken[]> {
        return this.boxTokenService.findAll(user.id, args)
    }

}
