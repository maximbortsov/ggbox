import { IsEnum } from 'class-validator'
import { Roles } from '../../../config/roles'
import { IsUsername } from '../../../shared/decorators/validation/is-username.decorator'
import { Expose } from 'class-transformer'
import { IsFlowWallet } from '../../../shared/decorators/validation/is-flow-wallet.decorator'


export class CreateUserDataDto {

    @Expose()
    @IsFlowWallet()
    flowWallet: string

    @Expose()
    @IsUsername()
    username: string

    @Expose()
    @IsEnum(Roles, { each: true })
    roles: Roles[] = [Roles.USER]

}
