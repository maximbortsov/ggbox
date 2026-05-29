import { isNumber, min, registerDecorator, ValidationOptions } from 'class-validator'


export function IsPrice(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: 'IsPrice',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: `${propertyName} must be a positive number. Maximum of two decimal places`,
                ...validationOptions,
            },
            validator: {
                validate(value: any): boolean {
                    return isNumber(value, { maxDecimalPlaces: 2 })
                        && min(value, 0)
                },
            },
        })
    }
}

