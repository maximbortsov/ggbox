import { Transform } from 'class-transformer'
import { isArray } from 'class-validator'


export function ToStringArray(canUndefined = true): PropertyDecorator {
    return Transform(({ value }) => {
        if (!isArray(value)) {
            value = [value]
        }
        value = value.filter((x) => x)

        return value.length === 0 ? (canUndefined ? undefined : []) : value
    }, { toClassOnly: true })
}
