import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import { GameService } from './game.service'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Game } from './entities/game.entity'
import { UpdateGameDto } from './dto/update-game.dto'
import { CreateGameDto } from './dto/create-game.dto'
import { MediaUpload } from '../../shared/decorators/media-upload.decorator'
import { ACAuth } from '../../shared/decorators/auth/ac-auth.decorator'
import { AppResources } from '../../config/roles'
import { ParamUUID } from '../../shared/decorators/param-uuid'


@Controller('game')
@ApiTags('game')
export class GameController {

    constructor(
        private readonly gameService: GameService,
    ) {
    }

    @Post()
    @ACAuth(AppResources.GAME, 'create', 'any')
    @MediaUpload({ putInBody: true, type: 'svg' })
    @ApiCreatedResponse({ type: Game })
    async create(@Body() dto: CreateGameDto): Promise<Game> {
        return this.gameService.create(dto)
    }

    @Get()
    @ApiOkResponse({ type: [Game] })
    async findAll(): Promise<Game[]> {
        return this.gameService.findAll()
    }

    @Get(':id')
    @ApiOkResponse({ type: Game })
    async findOne(@ParamUUID('id') id: string): Promise<Game> {
        return this.gameService.findOne({ id })
    }

    @Patch(':id')
    @ACAuth(AppResources.GAME, 'update', 'any')
    @MediaUpload({ putInBody: true, type: 'svg' })
    @ApiOkResponse({ type: Game })
    async update(@ParamUUID('id') id: string, @Body() dto: UpdateGameDto): Promise<Game> {
        return this.gameService.update(id, dto)
    }

    @Delete(':id')
    @ACAuth(AppResources.GAME, 'delete', 'any')
    @ApiOkResponse({ type: Game })
    async remove(@ParamUUID('id') id: string): Promise<Game> {
        return this.gameService.remove(id)
    }
}
