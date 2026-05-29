import { registerDecorator, ValidationOptions } from 'class-validator'
import validator from 'validator'
import isAfter = validator.isAfter


export function IsAfter(date?: Date, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: 'IsAfter',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: `${propertyName} must be ${date ? 'after ' + date.toString() : 'future date'}`,
                ...validationOptions,
            },
            validator: {
                validate(value: any) {
                    return value instanceof Date
                        && isAfter(value.toString(), date?.toString())
                },
            },
        })
    }
}
