import { Transform } from 'class-transformer'


export function ToBoolean(canUndefined = true): PropertyDecorator {
    const toPlain = Transform(
        ({ value }) => value,
        { toPlainOnly: true },
    )
    const toClass = (target: any, key: string | symbol): void => Transform(
        ({ obj }) => valueToBoolean(obj[key], canUndefined),
        { toClassOnly: true },
    )(target, key)
    return function (target: any, key: string | symbol) {
        toPlain(target, key)
        toClass(target, key)
    }
}

const valueToBoolean = (value: any, canUndefined: boolean): boolean | undefined => {
    if (value === null || value === undefined) {
        return canUndefined ? undefined : false
    }
    if (typeof value === 'boolean') {
        return value
    }
    if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
        return true
    }
    if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
        return false
    }
    return undefined
}
