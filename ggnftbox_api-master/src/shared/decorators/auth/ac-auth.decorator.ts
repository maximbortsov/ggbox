import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiForbiddenResponse } from '@nestjs/swagger'
import { ACGuard, Role, UseRoles } from 'nest-access-control'
import { AppResources } from '../../../config/roles'
import { ForbiddenException } from '../../swagger-errors'
import { ConfirmedAuth } from './confirmed-auth.decorator'


export function ACAuth(res: AppResources, action: Role['action'], possession: Role['possession']): ClassDecorator & MethodDecorator {
    return applyDecorators(
        ConfirmedAuth(),
        UseGuards(ACGuard),
        UseRoles({
            resource: res,
            action: action,
            possession: possession,
        }),
        ApiForbiddenResponse({ type: ForbiddenException }),
    )
}
