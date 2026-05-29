import { Body, Controller, Post, Req } from '@nestjs/common'
import { PayeerService } from './payeer.service'
import { ApiExcludeController } from '@nestjs/swagger'
import { PaymentHookDto } from './dto/payment-hook.dto'
import { Request } from 'express'


@Controller('payeer')
@ApiExcludeController()
export class PayeerController {

    constructor(
        private readonly payeerService: PayeerService,
    ) {
    }

    @Post('merchant')
    async getDepositData(@Body() data: PaymentHookDto, @Req() req: Request): Promise<string> {
        const ips = ['185.71.65.92', '185.71.65.189', '149.202.17.210']

        console.log('====== IPs ======')
        console.log(req.clientIp)
        console.log(ips.includes(req.clientIp ?? ''))
        console.log('===== CLOSE IPs ====')
        return this.payeerService.consume(data)
    }

}
