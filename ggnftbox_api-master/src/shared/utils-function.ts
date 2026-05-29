import { Money } from 'ts-money'
import { Request } from 'express'


/**
 * @desc Pick N random items from provided array
 */
export function getRandom<T>(arr: T[], n = 1): T[] {
    const res = new Array(n)
    let len = arr.length
    const taken = new Array(len)

    if (n > len) {
        console.log('RANDOM ERROR')
        throw new RangeError('getRandom: more elements taken than available')
    }

    while (n--) {
        const x = Math.floor(Math.random() * len)
        res[n] = arr[x in taken ? taken[x] : x]
        taken[x] = --len in taken ? taken[len] : len
    }
    return res
}

/**
 * @desc Pick unique objects by key from provided array
 */
export function uniqueBy<T, K extends keyof T>(array: T[], key: K): T[] {
    return Object.values(array.reduce((tmp: any, x) => {
        if (tmp[x[key]]) return tmp
        tmp[x[key]] = x
        return tmp
    }, {}))
}

/**
 * @desc Sort array of objects by property
 */
export function sortBy<T, K extends keyof T>(array: T[], key: K, desc = false): T[] {

    const reverse = 1 - 2 * Number(desc)

    return array.sort((a, b) => {
        const a1 = a[key]
        const b1 = b[key]
        if (typeof a1 === 'number' && typeof b1 === 'number') {
            return (a1 - b1) * reverse
        } else {
            return (a1 > b1 ? 1 : -1) * reverse
        }
    })
}

/**
 * @desc Sort object by key
 */
export function sortObject<T>(o: Record<string, T>): Record<string, T> {
    return Object.keys(o).sort().reduce<Record<string, T>>((r, k) => {
        r[k] = o[k]!
        return r
    }, {})
}

/**
 * @desc get money that is used in calculations in system
 */
export function getStandardizedMoney(amount: number): Money {
    return Money.fromDecimal(amount, 'USD', Math.floor)
}

/**
 * @desc convert object to array of key-value objects
 */
export function toKeyValueArray(o: Record<string, string>): Array<{ key: string; value: string }> {
    return Object.entries(o).map((a) => ({ key: a[0], value: a[1] }))
}

/**
 * @desc Only one attribute of object is defined
 */
export function checkOnlyOneAttr(o: Record<string, any>): boolean {
    let counter = 0

    for (const key in o) {
        if (o[key] !== undefined) {
            counter++
        }
    }

    return counter == 1
}

/**
 * @desc Get full URL from Request (express)
 */
export function getFullURL(req: Request, withParams = false): string {
    const host = req.get('host')
    if (!host) {
        throw new Error('Invalid host')
    }
    let path = req.originalUrl
    if (!withParams) {
        path = path.split('?').shift()!
    }
    return new URL(req.protocol + '://' + host + path).href
}
