import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../guards/auth-jwt.guard'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { UnauthorizedException } from '../../swagger-errors'


export function Auth(): ClassDecorator & MethodDecorator {
    return applyDecorators(
        UseGuards(JwtAuthGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ type: UnauthorizedException }),
    )
}
