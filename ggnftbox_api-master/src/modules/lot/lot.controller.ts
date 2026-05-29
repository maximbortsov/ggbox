import { Controller, Get, Query } from '@nestjs/common'
import { LotService } from './lot.service'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Lot } from './entities/lot.entity'
import { LotFindAllArgs } from './args/lot-find-all.args'
import { LotFindOneArgs } from './args/lot-find-one.args'
import { ParamUUID } from '../../shared/decorators/param-uuid'


@Controller('lot')
@ApiTags('lot')
export class LotController {

    constructor(
        private readonly lotService: LotService,
    ) {
    }

    @Get()
    @ApiOkResponse({ type: [Lot] })
    async findAll(@Query() args: LotFindAllArgs): Promise<Lot[]> {
        return this.lotService.findAll(args)
    }

    @Get(':id')
    @ApiOkResponse({ type: Lot })
    async findOne(@ParamUUID('id') id: string, @Query() args: LotFindOneArgs): Promise<Lot> {
        return this.lotService.findOne(id, args)
    }

}
