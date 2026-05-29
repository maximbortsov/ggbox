import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import RequestWithUser from '../request-with-user.interface'


export class EmailConfirmationGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request: RequestWithUser = context.switchToHttp().getRequest()

        if (!request.user?.isEmailConfirmed) {
            throw new UnauthorizedException('Confirm your email first')
        }

        return true
    }
}
