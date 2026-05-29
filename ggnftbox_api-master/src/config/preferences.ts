import { readFileSync, writeFileSync } from 'fs'
import * as path from 'path'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { IsUUID, validateSync } from 'class-validator'
import { dump, load } from 'js-yaml'

// TODO || process.cwd() vs __dirname
const FILE_PATH = path.join(process.cwd(), 'preferences.yaml')


export class Preferences {

    @IsUUID('4', { each: true })
    popularPlayIDs: string[]

    static get(): Preferences {
        const data = readFileSync(FILE_PATH, 'utf-8')

        const t = plainToInstance(Preferences, load(data))
        const errors = validateSync(t)
        if (errors.length != 0) {
            const message = errors.map((v) => Object.values(v.constraints ?? {}).join(', ')).join(' || ')
            throw new Error(`Wrong preferences: ${message}`)
        }
        return t
    }

    save(): void {
        const data = dump(instanceToPlain(this))
        writeFileSync(FILE_PATH, data, { encoding: 'utf-8' })
    }
}
