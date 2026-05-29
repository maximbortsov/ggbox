import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import { StreamerService } from './streamer.service'
import { CreateStreamerDto } from './dto/create-streamer.dto'
import { UpdateStreamerDto } from './dto/update-streamer.dto'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Streamer } from './entities/streamer.entity'
import { ACAuth } from '../../shared/decorators/auth/ac-auth.decorator'
import { AppResources } from '../../config/roles'
import { ParamUUID } from '../../shared/decorators/param-uuid'


@Controller('streamer')
@ApiTags('streamer')
export class StreamerController {
    constructor(
        private readonly streamerService: StreamerService,
    ) {
    }

    @Post()
    @ACAuth(AppResources.STREAMER, 'create', 'any')
    @ApiCreatedResponse({ type: Streamer })
    async create(@Body() dto: CreateStreamerDto): Promise<Streamer> {
        return this.streamerService.create(dto)
    }

    @Get()
    @ApiOkResponse({ type: [Streamer] })
    async findAll(): Promise<Streamer[]> {
        return this.streamerService.findAll()
    }

    @Get(':id')
    @ApiOkResponse({ type: Streamer })
    async findOne(@ParamUUID('id') id: string): Promise<Streamer> {
        return this.streamerService.findOne({ id })
    }

    @Patch(':id')
    @ACAuth(AppResources.STREAMER, 'update', 'any')
    @ApiOkResponse({ type: Streamer })
    async update(@ParamUUID('id') id: string, @Body() dto: UpdateStreamerDto): Promise<Streamer> {
        return this.streamerService.update(id, dto)
    }

    @Delete(':id')
    @ACAuth(AppResources.STREAMER, 'delete', 'any')
    @ApiOkResponse({ type: Streamer })
    async remove(@ParamUUID('id') id: string): Promise<Streamer> {
        return this.streamerService.remove(id)
    }
}
