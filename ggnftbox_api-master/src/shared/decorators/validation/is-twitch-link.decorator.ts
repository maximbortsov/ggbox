import { isURL, matches, registerDecorator, ValidationOptions } from 'class-validator'
import { TWITCH_LINK_REGEX } from '../../consts/regexp'


export function IsTwitchLink(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: 'IsTwitchLink',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: `provide valid twitch link`,
                ...validationOptions,
            },
            validator: {
                validate(value: any) {
                    return typeof value === 'string'
                        && isURL(value, {
                            require_protocol: true,
                            protocols: ['https'],
                            allow_query_components: false,
                            host_whitelist: ['twitch.tv'],
                        })
                        && matches(value, TWITCH_LINK_REGEX)
                },
            },
        })
    }
}
