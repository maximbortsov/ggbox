import { IncompatibleWith } from '../../../shared/decorators/validation/incompatible-with.decorator'
import { IsString, IsUUID } from 'class-validator'
import { IsUsername } from '../../../shared/decorators/validation/is-username.decorator'
import { Expose } from 'class-transformer'
import { IsFlowWallet } from '../../../shared/decorators/validation/is-flow-wallet.decorator'


export class ConnectUserDto {

    @Expose()
    @IncompatibleWith(['username', 'email'])
    @IsUUID('4')
    id?: string

    @Expose()
    @IncompatibleWith(['id', 'email'])
    @IsUsername()
    username?: string

    @Expose()
    @IncompatibleWith(['username', 'id'])
    @IsString()
    @IsFlowWallet()
    flowWallet?: string
}
