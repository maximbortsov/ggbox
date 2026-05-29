import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { BoxService } from './box.service'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Box } from './entities/box.entity'
import { CreateBoxDto } from './dto/create-box.dto'
import { UpdateBoxDto } from './dto/update-box.dto'
import { MediaUpload } from '../../shared/decorators/media-upload.decorator'
import { BoxFindAllArgs } from './args/box-find-all.args'
import { BoxFindOneArgs } from './args/box-find-one.args'
import { UpdateBoxVideoDto } from './dto/update-box-video.dto'
import { ACAuth } from '../../shared/decorators/auth/ac-auth.decorator'
import { AppResources } from '../../config/roles'
import { ParamUUID } from '../../shared/decorators/param-uuid'


@ApiTags('box')
@Controller('box')
export class BoxController {

    constructor(
        private readonly boxService: BoxService,
    ) {
    }

    @Post()
    @ACAuth(AppResources.BOX, 'create', 'any')
    @MediaUpload({ putInBody: true, required: true, type: 'image' })
    @ApiCreatedResponse({ type: Box })
    async create(@Body() dto: CreateBoxDto): Promise<Box> {
        return this.boxService.create(dto)
    }

    @Get()
    @ApiOkResponse({ type: [Box] })
    async findAll(@Query() args: BoxFindAllArgs): Promise<Box[]> {
        return this.boxService.findAll(args)
    }

    @Get(':id')
    @ApiOkResponse({ type: Box })
    async findOne(@ParamUUID('id') id: string, @Query() args: BoxFindOneArgs): Promise<Box> {
        return this.boxService.findOne(id, args)
    }

    @Patch(':id')
    @ACAuth(AppResources.BOX, 'update', 'any')
    @MediaUpload({ putInBody: true, type: 'image' })
    @ApiOkResponse({ type: Box })
    async update(@ParamUUID('id') id: string, @Body() dto: UpdateBoxDto): Promise<Box> {
        return this.boxService.update(id, dto)
    }

    @Patch(':id/open-video')
    @ACAuth(AppResources.BOX, 'update', 'any')
    @MediaUpload({ putInBody: true, required: true, type: 'video' })
    @ApiOkResponse({ type: Box })
    async updateVideo(@ParamUUID('id') id: string, @Body() dto: UpdateBoxVideoDto): Promise<Box> {
        return this.boxService.updateOpenVideo(id, dto)
    }

    @Patch(':id/open-mobile-video')
    @ACAuth(AppResources.BOX, 'update', 'any')
    @MediaUpload({ putInBody: true, required: true, type: 'video' })
    @ApiOkResponse({ type: Box })
    async updateMobileVideo(@ParamUUID('id') id: string, @Body() dto: UpdateBoxVideoDto): Promise<Box> {
        return this.boxService.updateOpenMobileVideo(id, dto)
    }

    @Delete(':id')
    @ACAuth(AppResources.BOX, 'delete', 'any')
    @ApiOkResponse({ type: Box })
    async remove(@ParamUUID('id') id: string): Promise<Box> {
        return this.boxService.remove(id)
    }
}
