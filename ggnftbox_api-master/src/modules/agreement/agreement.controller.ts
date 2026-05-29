import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import { AgreementService } from './agreement.service'
import { CreateAgreementDto } from './dto/create-agreement.dto'
import { UpdateAgreementDto } from './dto/update-agreement.dto'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Agreement } from './entities/agreement.entity'
import { ACAuth } from '../../shared/decorators/auth/ac-auth.decorator'
import { AppResources } from '../../config/roles'
import { ParamUUID } from '../../shared/decorators/param-uuid'


@Controller('agreement')
@ApiTags('agreement')
export class AgreementController {

    constructor(
        private readonly agreementService: AgreementService,
    ) {
    }

    @Post()
    @ACAuth(AppResources.AGREEMENT, 'create', 'any')
    @ApiCreatedResponse({ type: Agreement })
    async create(@Body() createAgreementDto: CreateAgreementDto): Promise<Agreement> {
        return this.agreementService.create(createAgreementDto)
    }

    @Get()
    @ApiOkResponse({ type: [Agreement] })
    async findAll(): Promise<Agreement[]> {
        return this.agreementService.findAll()
    }

    @Get(':id')
    @ApiOkResponse({ type: Agreement })
    async findOne(@ParamUUID('id') id: string): Promise<Agreement> {
        return this.agreementService.findOne(id)
    }

    @Patch(':id')
    @ApiOkResponse({ type: Agreement })
    async update(@ParamUUID('id') id: string, @Body() updateAgreementDto: UpdateAgreementDto): Promise<Agreement> {
        return this.agreementService.update(id, updateAgreementDto)
    }

    @Delete(':id')
    @ApiOkResponse({ type: Agreement })
    async remove(@ParamUUID('id') id: string): Promise<Agreement> {
        return this.agreementService.remove(id)
    }
}
