import { Transform } from 'class-transformer'


export function ToNumber(): PropertyDecorator {
    const toPlain = Transform(
        ({ value }) => value,
        { toPlainOnly: true },
    )
    const toClass = (target: any, key: string | symbol): void => Transform(
        ({ obj }) => valueToNumber(obj[key]),
        { toClassOnly: true },
    )(target, key)
    return function (target: any, key: string | symbol) {
        toPlain(target, key)
        toClass(target, key)
    }
}

const valueToNumber = (value: any): number | undefined => {
    if (value === null || value === undefined) {
        return undefined
    }
    if (typeof value === 'number') {
        return value
    }
    const num = Number(value)
    if (isNaN(num)) {
        return undefined
    }
    return num
}
