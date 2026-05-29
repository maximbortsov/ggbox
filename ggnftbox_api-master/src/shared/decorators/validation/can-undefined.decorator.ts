import { ValidateIf, ValidationOptions } from 'class-validator'


export function CanUndefined(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateIf((_object, value) => value !== undefined, validationOptions)
}
