import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'


export function ApiFile(options?: ApiPropertyOptions): PropertyDecorator {
    return function (target: Record<string, any>, propertyKey: string | symbol) {
        if (options?.isArray) {
            ApiProperty({
                ...options,
                type: 'array',
                items: {
                    type: 'file',
                    properties: {
                        [propertyKey]: {
                            type: 'string',
                            format: 'binary',
                        },
                    },
                },
            })(target, propertyKey)
        } else {
            ApiProperty({
                ...options,
                type: 'file',
                properties: {
                    [propertyKey]: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            })(target, propertyKey)
        }
    }
}
