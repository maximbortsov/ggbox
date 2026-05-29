import { IsDefined } from 'class-validator'


export class CreateLotDto {

    @IsDefined()
    price: number

    @IsDefined()
    nft: { connect: { id: string } }
}