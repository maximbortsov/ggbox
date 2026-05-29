import { Body, Controller, Get, Patch } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { User } from './entities/user.entity'
import { AuthUser } from '../../shared/decorators/auth/auth-user.decorator'
import { plainToInstance } from 'class-transformer'
import { Auth } from 'src/shared/decorators/auth/auth.decorator'
import { ACAuth } from '../../shared/decorators/auth/ac-auth.decorator'
import { AppResources } from '../../config/roles'
import { UpdateUserDto } from './dto/update-user.dto'
import { MediaUpload } from '../../shared/decorators/media-upload.decorator'
import { UserTransaction } from './entities/user-transaction.entity'
import { ParamUUID } from '../../shared/decorators/param-uuid'


@Controller('user')
@ApiTags('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) {
    }

    @Get('all-transactions')
    @ACAuth(AppResources.USER, 'read', 'own')
    @ApiOkResponse({ type: [UserTransaction] })
    async getAllTransactions(@AuthUser() user: User): Promise<UserTransaction[]> {
        return this.userService.getAllTransactions(user.id)
    }

    @Get()
    @ApiOkResponse({ type: [User] })
    async findAll(): Promise<User[]> {
        return this.userService.findAll()
    }

    @Get('me')
    @Auth()
    @ApiOkResponse({ type: User })
    async user(@AuthUser() user: User): Promise<User> {
        return plainToInstance(User, user)
    }

    @Get(':id')
    @ApiOkResponse({ type: User })
    async findOne(@ParamUUID('id') id: string): Promise<User> {
        return this.userService.findOne({ id })
    }

    @Patch()
    @ACAuth(AppResources.USER, 'update', 'own')
    @MediaUpload({ putInBody: true, type: 'image' })
    @ApiOkResponse({ type: User })
    async update(@AuthUser() user: User, @Body() dto: UpdateUserDto): Promise<User> {
        return this.userService.update(user.id, dto)
    }
}

