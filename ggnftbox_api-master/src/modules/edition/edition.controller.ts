import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { EditionService } from './edition.service'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import ResponseBoolean from '../../shared/response-boolean'
import { ACAuth } from '../../shared/decorators/auth/ac-auth.decorator'
import { AppResources } from '../../config/roles'
import { CreateEditionDto } from './dto/create-edition.dto'
import { Edition } from './entities/edition.entity'
import { Request } from 'express'
import { EditionFindAllArgs } from './args/edition-find-all.args'
import { EditionFindOneArgs } from './args/edition-find-one.args'
import { ParamUUID } from '../../shared/decorators/param-uuid'


@Controller('edition')
@ApiTags('edition')
export class EditionController {

    constructor(
        private readonly editionService: EditionService,
    ) {
    }

    @Post()
    @ACAuth(AppResources.EDITION, 'create', 'any')
    @ApiCreatedResponse({ type: ResponseBoolean })
    async create(@Body() dto: CreateEditionDto): Promise<ResponseBoolean> {
        return this.editionService.sendToCreate(dto)
    }

    @Get()
    @ApiOkResponse({ type: [Edition] })
    async findAll(@Query() args: EditionFindAllArgs, @Req() req: Request): Promise<Edition[]> {
        return this.editionService.findAll(args)
    }

    @Get(':id')
    @ApiOkResponse({ type: Edition })
    async findOne(@ParamUUID('id') id: string, @Query() args: EditionFindOneArgs): Promise<Edition> {
        return this.editionService.findOne({ id }, args)
    }

}
