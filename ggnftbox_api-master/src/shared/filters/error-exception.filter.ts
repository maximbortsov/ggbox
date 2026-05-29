import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { BaseExceptionFilter } from '@nestjs/core'


@Catch(Error)
export class ErrorExceptionFilter extends BaseExceptionFilter {
    catch(exception: Error, host: ArgumentsHost): void {

        if (exception.name != 'NotFoundException') {
            console.log('ErrorExceptionFilter')
            console.log(exception)
        }

        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        switch (exception.name) {
            case 'NotFoundError':
                this.catchPrismaNotFound(exception, response)
                break
            default:
                super.catch(exception, host)
                break
        }
    }

    catchPrismaNotFound(exception: Error, response: Response): void {
        const status = HttpStatus.NOT_FOUND
        response.status(status).json({
            statusCode: status,
            message: exception.message,
        })
    }
}
