import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import RequestWithUser from '../../request-with-user.interface'


/**
 * retrieve the current user with a decorator
 * example of a controller method:
 * @Post()
 * someMethod(@AuthUser() user: User) {
 *   // do something with the user
 * }
 */
export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<RequestWithUser>()
        return request.user
    },
)
