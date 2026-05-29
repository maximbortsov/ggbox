export const prettyDateTime = (datetime: Date): string => {

    const date = new Date(datetime)

    return (date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString()) + '.' +
        (date.getMonth() < 9 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()) + '.' +
        date.getFullYear().toString() + ' ' +
        (date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString()) + ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString()) + ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds().toString())
}

export const prettyDate = (datetime: Date): string => {

    const date = new Date(datetime)

    return (date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString()) + '.' +
        (date.getMonth() < 9 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()) + '.' +
        date.getFullYear().toString()
}