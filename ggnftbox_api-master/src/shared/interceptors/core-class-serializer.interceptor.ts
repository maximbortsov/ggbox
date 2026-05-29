import {
    CallHandler,
    ClassSerializerInterceptor,
    CustomDecorator,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    PlainLiteralObject,
    SetMetadata,
    Type,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { ClassTransformOptions, plainToInstance } from 'class-transformer'
import { Reflector } from '@nestjs/core'


export const REST_RETURN_TYPE = 'REST_RETURN_TYPE'
export const RestReturn = (type: Type): CustomDecorator => SetMetadata('REST_RETURN_TYPE', type)


@Injectable()
export class CoreClassSerializerInterceptor extends ClassSerializerInterceptor {
    private readonly logger = new Logger(CoreClassSerializerInterceptor.name)

    constructor(@Inject('Reflector') protected readonly reflector: Reflector,
                defaultOptions?: ClassTransformOptions) {
        super(reflector, defaultOptions)
        this.logger.log('create')
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() === 'http') {
            const contextOptions = this.getContextOptions(context)
            const options = {
                ...this.defaultOptions,
                ...contextOptions,
            }

            return next
                .handle()
                .pipe(
                    map((res: PlainLiteralObject | PlainLiteralObject[]) =>
                        this.serialize(res, {
                            ...options,
                            returnClass: Reflect.getMetadata(REST_RETURN_TYPE, context.getHandler()),
                        }),
                    ),
                )
        }
        return next.handle()
    }

    serialize(
        response: PlainLiteralObject | PlainLiteralObject[],
        options: ClassTransformOptions & { returnClass: any },
    ): PlainLiteralObject | PlainLiteralObject[] {
        try {
            return super.serialize(options.returnClass ? plainToInstance(options.returnClass, response) : response, options)
        } catch (err) {
            this.logger.debug(response)
            this.logger.error(err)
            throw err
        }
    }
}
