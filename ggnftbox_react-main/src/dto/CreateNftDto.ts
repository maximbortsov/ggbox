import { IsPositive } from 'class-validator'


export class CreateNftDto {

    @IsPositive()
    serialNumber: number

    flowID = 'mock'
    link = 'NO SUPPORT. DON\'T CHANGE'
    owner = { connect: { id: '0d44de38-2613-487e-b9c5-d350da988c27' } } //TODO: change
    play = { connect: { id: '' } }
    box = { connect: { id: '' } }
}