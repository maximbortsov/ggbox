import { applyDecorators, NestInterceptor, Type, UseInterceptors } from '@nestjs/common'
import { ApiBadRequestResponse, ApiConsumes, ApiPayloadTooLargeResponse } from '@nestjs/swagger'
import { FileToBodyInterceptor } from '../interceptors/file-to-body.interceptor'
import MediaInterceptor from '../interceptors/media.interceptor'


export interface MediaUploadParams {
    fieldname?: string
    putInBody?: boolean
    required?: boolean
    type: 'video' | 'image' | 'svg'
}


export function MediaUpload(params: MediaUploadParams): MethodDecorator & ClassDecorator {
    if (params.fieldname === undefined) {
        params.fieldname = 'file'
    }

    const interceptors: Array<Type<NestInterceptor>> = [MediaInterceptor({
        fieldname: params.fieldname,
        required: params.required,
        type: params.type,
    })]

    if (params.putInBody) {
        interceptors.push(FileToBodyInterceptor)
    }
    return applyDecorators(
        ApiConsumes('multipart/form-data'),
        ApiPayloadTooLargeResponse(),
        ApiBadRequestResponse(),
        UseInterceptors(...interceptors),
    )
}
