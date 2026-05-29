import { Body, Controller, Post } from '@nestjs/common'
import { SetService } from './set.service'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import ResponseBoolean from '../../shared/response-boolean'
import { ACAuth } from '../../shared/decorators/auth/ac-auth.decorator'
import { AppResources } from '../../config/roles'
import { CreateSetDto } from './dto/create-set.dto'


@Controller('set')
@ApiTags('set')
export class SetController {

    constructor(
        private readonly setService: SetService,
    ) {
    }

    @Post()
    @ACAuth(AppResources.SET, 'create', 'any')
    @ApiCreatedResponse({ type: ResponseBoolean })
    async create(@Body() dto: CreateSetDto): Promise<ResponseBoolean> {
        return this.setService.sendToCreate(dto.name)
    }

}
