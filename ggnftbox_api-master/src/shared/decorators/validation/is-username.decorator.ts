import { isAlphanumeric, maxLength, minLength, registerDecorator, ValidationOptions } from 'class-validator'


export function IsUsername(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: 'IsUsername',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: `${propertyName} must be alphanumeric string from 2 to 128 in length`,
                ...validationOptions,
            },
            validator: {
                validate(value: any) {
                    return typeof value === 'string'
                        && isAlphanumeric(value)
                        && minLength(value, 2)
                        && maxLength(value, 128)
                },
            },
        })
    }
}
