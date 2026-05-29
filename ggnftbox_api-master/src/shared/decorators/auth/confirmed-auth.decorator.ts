import { applyDecorators, UseGuards } from '@nestjs/common'
import { EmailConfirmationGuard } from '../../guards/email-confirmation.guard'
import { Auth } from './auth.decorator'


export function ConfirmedAuth(): ClassDecorator & MethodDecorator {
    return applyDecorators(
        Auth(),
        UseGuards(EmailConfirmationGuard),
    )
}
