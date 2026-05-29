import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { NftService } from './nft.service'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Nft } from './entities/nft.entity'
import { NftFindAllArgs } from './args/nft-find-all.args'
import { ACAuth } from '../../shared/decorators/auth/ac-auth.decorator'
import { AppResources } from '../../config/roles'
import ResponseBoolean from '../../shared/response-boolean'
import { CreateNftDto } from './dto/create-nft.dto'
import { ParamUUID } from '../../shared/decorators/param-uuid'


@Controller('nft')
@ApiTags('nft')
export class NftController {
    constructor(
        private readonly nftService: NftService,
    ) {
    }

    @Post()
    @ACAuth(AppResources.NFT, 'create', 'any')
    @ApiCreatedResponse({ type: ResponseBoolean })
    async create(@Body() dto: CreateNftDto): Promise<ResponseBoolean> {
        return this.nftService.sendToCreate(dto)
    }

    @Get()
    @ApiOkResponse({ type: [Nft] })
    async findAll(@Query() args: NftFindAllArgs): Promise<Nft[]> {
        return this.nftService.findAll(args)
    }

    @Get(':id')
    @ApiOkResponse({ type: Nft })
    async findOne(@ParamUUID('id') id: string): Promise<Nft> {
        return this.nftService.findOne({ id })
    }
}
