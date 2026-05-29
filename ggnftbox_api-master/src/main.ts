import 'reflect-metadata'
import * as ffmpeg_installer from '@ffmpeg-installer/ffmpeg'
import * as ffprobe_installer from '@ffprobe-installer/ffprobe'
import * as ffmpeg from 'fluent-ffmpeg'
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { SwaggerModule } from '@nestjs/swagger'
import { mw } from 'request-ip'
import { ConfigService } from '@nestjs/config'
import { AssetsConfig, CorsConfig, NestConfig } from './config/config.interface'
import { swaggerDocument, swaggerDocumentOptions, swaggerPath, swaggerSetupOptions } from './config/swagger'
import { sortObject } from './shared/utils-function'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import { PrismaKnownExceptionFilter } from './shared/filters/prisma-known-exception.filter'
import { ErrorExceptionFilter } from './shared/filters/error-exception.filter'
import { raw } from 'express'
import { PrismaService } from './modules/prisma/prisma.service'


ffmpeg.setFfmpegPath(ffmpeg_installer.path)
ffmpeg.setFfprobePath(ffprobe_installer.path)

async function bootstrap(): Promise<void> {

    const app = await NestFactory.create<NestExpressApplication>(AppModule)

    const prismaService: PrismaService = app.get(PrismaService)
    const { httpAdapter } = app.get(HttpAdapterHost)

    const configService = app.get(ConfigService)
    const nestConfig = configService.get<NestConfig>('nest')
    const corsConfig = configService.get<CorsConfig>('cors')

    app.setGlobalPrefix('/api')

    // Ray body for route
    app.use('/api/graffle-receiver', raw({ type: '*/*' }))

    // -----------------------------------
    // STATIC ASSETS
    // -----------------------------------
    const assetsDir = configService.get<AssetsConfig>('assets')?.dir ?? ''
    app.useStaticAssets(
        join(process.cwd(), assetsDir),
        {
            index: false,
            prefix: '/files',
        },
    )

    // -----------------------------------
    // PRISMA
    // -----------------------------------
    await prismaService.enableShutdownHooks(app)

    // -----------------------------------
    // FILTERS
    // -----------------------------------
    app.useGlobalFilters(
        new ErrorExceptionFilter(httpAdapter),
        new PrismaKnownExceptionFilter(httpAdapter),
    )

    // -----------------------------------
    // INTERCEPTORS
    // -----------------------------------
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector), {
            excludeExtraneousValues: true,
        }),
    )

    // -----------------------------------
    // REQUEST VALIDATION
    // -----------------------------------
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            disableErrorMessages: false,
            transformOptions: {
                excludeExtraneousValues: true,
                enableImplicitConversion: false,
            },
        }),
        // new TrimPipe(),
    )
    app.use(mw())

    // -----------------------------------
    // SWAGGER
    // -----------------------------------
    const document = SwaggerModule.createDocument(app, swaggerDocument, swaggerDocumentOptions)
    if (document.components?.schemas) {
        document.components.schemas = sortObject(document.components.schemas)
    }
    SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions)

    // -----------------------------------
    // CORS
    // -----------------------------------
    if (corsConfig?.enabled) {
        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        })
    }

    // -----------------------------------
    // START SERVER
    // -----------------------------------
    await app.listen(nestConfig?.port ?? 3000)
    console.log(`Application is running on: ${await app.getUrl()}`)
}

void bootstrap()
