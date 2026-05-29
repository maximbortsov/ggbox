import { IsDefined, IsObject, IsString } from 'class-validator'
import { IsFlowWallet } from '../../../shared/decorators/validation/is-flow-wallet.decorator'
import { Expose } from 'class-transformer'


export class FlowAccProofDto {

    @Expose()
    @IsString()
    @IsFlowWallet()
    address: string

    @Expose()
    @IsString()
    nonce: string

    @Expose()
    @IsDefined()
    @IsObject({ each: true })
    signatures: Array<Record<string, unknown>>
}
