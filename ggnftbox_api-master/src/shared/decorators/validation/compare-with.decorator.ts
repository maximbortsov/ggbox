import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'


type Comparators = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'

export function CompareWith(comparator: Comparators, property: string, resIfOptional = false, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: 'CompareWith',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: {
                message: () => {
                    let t = `${propertyName} must be ${comparator} ${property}`
                    t += resIfOptional ? ` OR ${property} must be optional` : ` AND ${property} must not be optional`
                    return t
                },
                ...validationOptions,
            },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints
                    let relatedValue = (args.object as any)[relatedPropertyName]
                    if (relatedValue === undefined || relatedValue === null) {
                        return resIfOptional
                    }
                    if (value instanceof Date) {
                        value = +value
                    }
                    if (relatedValue instanceof Date) {
                        relatedValue = +relatedValue
                    }
                    if (typeof value !== 'number' || typeof relatedValue !== 'number') {
                        return false
                    }
                    switch (comparator) {
                        case 'eq':
                            return value === relatedValue
                        case 'ne':
                            return value !== relatedValue
                        case 'gt':
                            return value > relatedValue
                        case 'gte':
                            return value >= relatedValue
                        case 'lt':
                            return value < relatedValue
                        case 'lte':
                            return value <= relatedValue
                    }
                },
            },
        })
    }
}
