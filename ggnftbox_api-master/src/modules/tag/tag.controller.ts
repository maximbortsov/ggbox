import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import { TagService } from './tag.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Tag } from './entities/tag.entity'
import { ACAuth } from '../../shared/decorators/auth/ac-auth.decorator'
import { AppResources } from '../../config/roles'
import { ParamUUID } from '../../shared/decorators/param-uuid'


@Controller('tag')
@ApiTags('tag')
export class TagController {

    constructor(
        private readonly tagService: TagService,
    ) {
    }

    @Post()
    @ACAuth(AppResources.TAG, 'create', 'any')
    @ApiCreatedResponse({ type: Tag })
    async create(@Body() dto: CreateTagDto): Promise<Tag> {
        return this.tagService.create(dto)
    }

    @Get()
    @ApiOkResponse({ type: [Tag] })
    async findAll(): Promise<Tag[]> {
        return this.tagService.findAll()
    }

    @Get(':id')
    @ApiOkResponse({ type: Tag })
    async findOne(@ParamUUID('id') id: string): Promise<Tag> {
        return this.tagService.findOne(id)
    }

    @Patch(':id')
    @ACAuth(AppResources.TAG, 'update', 'any')
    @ApiOkResponse({ type: Tag })
    async update(@ParamUUID('id') id: string, @Body() dto: UpdateTagDto): Promise<Tag> {
        return this.tagService.update(id, dto)
    }

    @Delete(':id')
    @ACAuth(AppResources.TAG, 'delete', 'any')
    @ApiOkResponse({ type: Tag })
    async remove(@ParamUUID('id') id: string): Promise<Tag> {
        return this.tagService.remove(id)
    }
}
