import { BadRequestException, Injectable, mixin, NestInterceptor, Type } from '@nestjs/common'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { FileInterceptor } from '@nestjs/platform-express'
import * as path from 'path'
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface'
import { CallHandler } from '@nestjs/common/interfaces/features/nest-interceptor.interface'
import { Observable } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { AssetsConfig } from '../../config/config.interface'
import { memoryStorage } from 'multer'


export interface MediaInterceptorParams {
    fieldname: string
    required?: boolean
    type: 'video' | 'image' | 'svg'
}


function MediaInterceptor(params: MediaInterceptorParams): Type<NestInterceptor> {
    @Injectable()
    class Interceptor implements NestInterceptor {
        fileInterceptor: NestInterceptor

        constructor(configService: ConfigService) {
            const multerOptions: MulterOptions = {
                storage: memoryStorage(),
                fileFilter: (request, file, callback) => {
                    const ext = path.extname(file.originalname)
                    switch (params.type) {
                        case 'video':
                            if (!file.mimetype.includes('video') || ext !== '.mp4') {
                                return callback(
                                    new BadRequestException('Provide a valid video (.mp4)'),
                                    false,
                                )
                            }
                            break
                        case 'image':
                            if (!file.mimetype.includes('image') || (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg')) {
                                return callback(
                                    new BadRequestException('Provide a valid image (.jpg, .jpeg, .png, .gif)'),
                                    false,
                                )
                            }
                            break
                        case 'svg':
                            if (!file.mimetype.includes('image') || ext !== '.svg') {
                                return callback(
                                    new BadRequestException('Provide a valid image (.svg)'),
                                    false,
                                )
                            }
                            break
                    }
                    callback(null, true)
                },
                limits: {
                    fileSize: configService.get<AssetsConfig>('assets')?.maxSize,
                },
            }

            this.fileInterceptor = new (FileInterceptor(params.fieldname, multerOptions))
        }

        async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
            const t = await this.fileInterceptor.intercept(context, next)
            const req = context.switchToHttp().getRequest()
            if (params.required && !req?.file?.buffer) {
                throw new BadRequestException('No image file')
            }
            return t
        }
    }


    return mixin(Interceptor)
}

export default MediaInterceptor
