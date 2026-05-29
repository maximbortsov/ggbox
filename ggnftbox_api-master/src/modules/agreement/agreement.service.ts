import { Injectable } from '@nestjs/common'
import { CreateAgreementDto } from './dto/create-agreement.dto'
import { UpdateAgreementDto } from './dto/update-agreement.dto'
import { PrismaService } from '../prisma/prisma.service'
import { Agreement } from './entities/agreement.entity'


@Injectable()
export class AgreementService {
    constructor(
        private readonly prisma: PrismaService,
    ) {
    }

    async create(createAgreementDto: CreateAgreementDto): Promise<Agreement> {
        return this.prisma.agreement.create({ data: createAgreementDto })
    }

    async findAll(): Promise<Agreement[]> {
        return this.prisma.agreement.findMany()
    }

    async findOne(id: string): Promise<Agreement> {
        return this.prisma.agreement.findUniqueOrThrow({ where: { id: id } })
    }

    async update(id: string, updateAgreementDto: UpdateAgreementDto): Promise<Agreement> {
        return this.prisma.agreement.update({
            where: { id: id },
            data: updateAgreementDto,
        })
    }

    async remove(id: string): Promise<Agreement> {
        return this.prisma.agreement.delete({ where: { id: id } })
    }
}
