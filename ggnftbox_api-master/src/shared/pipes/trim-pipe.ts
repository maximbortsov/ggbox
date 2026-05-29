import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'


@Injectable()
export class TrimPipe implements PipeTransform {

    private static isObj(obj: any): boolean {
        return typeof obj === 'object' && obj !== null
    }

    transform(values: any, metadata: ArgumentMetadata) {
        const { type } = metadata
        if (TrimPipe.isObj(values) && type === 'body') {
            return this.trim(values)
        }

        throw new BadRequestException('Validation failed')
    }

    private trim(values): any {
        Object.keys(values).forEach((key) => {
            if (key !== 'password') {
                if (TrimPipe.isObj(values[key])) {
                    values[key] = this.trim(values[key])
                } else {
                    if (typeof values[key] === 'string') {
                        values[key] = values[key].trim()
                    }
                }
            }
        })
        return values
    }
}
