import { readFileSync } from 'fs'
import * as path from 'path'


export default function readCodeScript(to: string): string {
    return readFileSync(path.join(process.cwd(), '/cadence/scripts/', to + '.cdc')).toString()
}
