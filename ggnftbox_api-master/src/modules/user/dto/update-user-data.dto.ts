import { IsOptional } from 'class-validator'
import { IsUsername } from '../../../shared/decorators/validation/is-username.decorator'
import { Expose } from 'class-transformer'
import { IsFlowWallet } from '../../../shared/decorators/validation/is-flow-wallet.decorator'


export class UpdateUserDataDto {

    @Expose()
    @IsOptional()
    @IsUsername()
    username: string

    @Expose()
    @IsOptional()
    @IsFlowWallet()
    flowWallet?: string

}
