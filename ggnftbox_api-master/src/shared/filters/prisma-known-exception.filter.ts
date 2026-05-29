import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Prisma } from '@prisma/client'
import { Response } from 'express'


@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaKnownExceptionFilter extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {

        console.log('PrismaKnownExceptionFilter')
        console.log(exception)

        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        switch (exception.code) {
            case 'P2000':
                this.catchValueTooLong(exception, response)
                break
            case 'P2002':
                this.catchUniqueConstraint(exception, response)
                break
            case 'P2025':
                this.catchNotFound(exception, response)
                break
            default:
                // TODO || FOR TEST
                response.status(500).json({
                    statusCode: 500,
                    message: exception.message,
                })
                // this.unhandledException(exception, host)
                break
        }
    }

    /**
     * Catches P2000 error code
     * https://www.prisma.io/docs/reference/api-reference/error-reference#p2000
     *
     * @param exception P2000
     * @param response 400 Bad Request
     */
    catchValueTooLong(
        exception: Prisma.PrismaClientKnownRequestError,
        response: Response,
    ): void {
        const status = HttpStatus.BAD_REQUEST
        const field = exception.meta?.['column_name']
        let msg = '(Not available)'
        if (typeof field === 'string') {
            msg = `The provided value for field is too long. Field: ${field}`
        }
        response.status(status).json({
            statusCode: status,
            message: msg,
        })
    }

    /**
     * Catches P2002 error code
     * https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
     *
     * @param exception P2002
     * @param response 409 Conflict
     */
    catchUniqueConstraint(
        exception: Prisma.PrismaClientKnownRequestError,
        response: Response,
    ): void {
        const status = HttpStatus.CONFLICT
        const fields = exception.meta?.['target']
        let msg = '(Not available)'
        if (Array.isArray(fields) && typeof fields[0] === 'string') {
            const field = fields[0]
            msg = `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken`
        }
        response.status(status).json({
            statusCode: status,
            message: msg,
        })
    }

    /**
     * Catches P2025 error code
     * https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
     *
     * @param exception P2025
     * @param response 404 Not Found
     */
    catchNotFound(
        exception: Prisma.PrismaClientKnownRequestError,
        response: Response,
    ): void {
        const status = HttpStatus.NOT_FOUND
        response.status(status).json({
            statusCode: status,
            message: exception.meta?.['cause'] ?? 'Not found',
        })
    }

    unhandledException(
        exception: Prisma.PrismaClientKnownRequestError,
        host: ArgumentsHost,
    ): void {
        // default 500 error code
        super.catch(exception, host)
    }
}
