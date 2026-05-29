import { readFileSync } from 'fs'
import * as path from 'path'


export default function readCodeTx(to: string): string {
    return readFileSync(path.join(process.cwd(), '/cadence/transactions/', to + '.cdc')).toString()
}
