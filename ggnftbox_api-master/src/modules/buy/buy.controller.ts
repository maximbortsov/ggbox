import { Controller, Post } from '@nestjs/common'
import { BuyService } from './buy.service'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { AuthUser } from '../../shared/decorators/auth/auth-user.decorator'
import { User } from '../user/entities/user.entity'
import { ACAuth } from '../../shared/decorators/auth/ac-auth.decorator'
import { AppResources } from '../../config/roles'
import { PaymentLink } from '../payeer/entity/payment-link.entity'
import { ParamUUID } from '../../shared/decorators/param-uuid'


@Controller('buy')
@ApiTags('buy')
export class BuyController {

    constructor(
        private readonly buyService: BuyService,
    ) {
    }

    @Post('box/:id')
    @ACAuth(AppResources.BUY, 'create', 'own')
    @ApiCreatedResponse({ type: PaymentLink })
    async getPaymentLink(@ParamUUID('id') boxId: string, @AuthUser() user: User): Promise<PaymentLink> {
        return this.buyService.createBoxPayment(user.id, boxId)
    }

}
