import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'


export class ForbiddenException {
    @Expose()
    @ApiProperty()
    statusCode: number
    @Expose()
    @ApiProperty()
    message: string
    @Expose()
    @ApiProperty()
    error: string
}


export class UnauthorizedException {
    @Expose()
    @ApiProperty()
    statusCode: number
    @Expose()
    @ApiProperty()
    message: string
}
