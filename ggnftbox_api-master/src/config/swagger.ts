import { DocumentBuilder, OpenAPIObject, SwaggerCustomOptions, SwaggerDocumentOptions } from '@nestjs/swagger'


export const swaggerPath = 'docs'

export const swaggerDocument: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('GGNFTBOX - NestJS API')
    .setDescription(
        '## NO Congratulations! API isn\'t ready.\n\n' +
        'All endpoints are secured with JWT Bearer authentication.\n' +
        'Learn more in [our docs](https://localhost:3000)',
    )
    .setVersion('0.0.1')
    .addBearerAuth()
    .build()

export const swaggerDocumentOptions: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
}

export const swaggerSetupOptions: SwaggerCustomOptions = {
    swaggerOptions: {
        displayRequestDuration: true,
        persistAuthorization: true,
        // If true, enables the top panel, which displays an edit box
        // that can be used to filter the displayed tagged operations
        filter: true,
        operationSorter: 'method',
        tagsSorter: 'alpha',
        showExtensions: true,
        showCommonExtensions: true,
    },
    // customCssUrl: '../swagger/swagger.css',
    // customFavIcon: '../swagger/favicon.png',
    customSiteTitle: 'GG API',
}
