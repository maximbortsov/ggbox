import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { PlayService } from './play.service'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { MediaUpload } from '../../shared/decorators/media-upload.decorator'
import { Play } from './entities/play.entity'
import { PlayFindAllArgs } from './args/play-find-all.args'
import { CreatePlayDto } from './dto/create-play.dto'
import ResponseBoolean from '../../shared/response-boolean'
import { ACAuth } from '../../shared/decorators/auth/ac-auth.decorator'
import { AppResources } from '../../config/roles'
import { PlayFindOneArgs } from './args/play-find-one.args'
import { Request } from 'express'
import { ParamUUID } from '../../shared/decorators/param-uuid'


@Controller('play')
@ApiTags('play')
export class PlayController {

    constructor(
        private readonly playService: PlayService,
    ) {
    }

    @Post()
    @ACAuth(AppResources.PLAY, 'create', 'any')
    @MediaUpload({ putInBody: true, required: true, fieldname: 'video', type: 'video' })
    @ApiCreatedResponse({ type: ResponseBoolean })
    async create(@Body() dto: CreatePlayDto): Promise<ResponseBoolean> {
        return this.playService.sendToCreate(dto)
    }

    @Get()
    @ApiOkResponse({ type: [Play] })
    async findAll(@Query() args: PlayFindAllArgs, @Req() req: Request): Promise<Play[]> {
        return this.playService.findAll(args)
    }

    @Get('popular')
    @ApiOkResponse({ type: [Play] })
    async getPopular(): Promise<Play[]> {
        return this.playService.getPopular()
    }

    @Get(':id')
    @ApiOkResponse({ type: Play })
    async findOne(@ParamUUID('id') id: string, @Query() args: PlayFindOneArgs): Promise<Play> {
        return this.playService.findOne({ id }, args)
    }

}
