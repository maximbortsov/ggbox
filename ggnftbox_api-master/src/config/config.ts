import { Config } from './config.interface'
import { Preferences } from './preferences'
import * as dotenv from 'dotenv'


dotenv.config()

const config: Config = {
    nest: {
        port: Number(process.env['PORT']) || 3000,
        domain: process.env['DOMAIN']!,
        protocol: process.env['PROTOCOL']!,
    },
    cors: {
        enabled: true,
    },
    security: {
        accessKey: process.env['JWT_ACCESS_SECRET']!,
        refreshKey: process.env['JWT_REFRESH_SECRET']!,
        expiresIn: '20d',
        refreshIn: '27d',
        bcryptRounds: 13,
    },
    assets: {
        dir: 'files',
        maxSize: 50 * 1024 * 1024,  // 50 MB
    },
    email: {
        debug: true,
        host: process.env['EMAIL_HOST']!,
        port: Number(process.env['EMAIL_PORT']!),
        user: process.env['EMAIL_USER']!,
        password: process.env['EMAIL_PASSWORD']!,
        redirectUrl: process.env['EMAIL_REDIRECT_URL']!,
    },
    emailSecurity: {
        secret: process.env['JWT_CONFIRMATION_SECRET']!,
        expiresIn: '2d',
    },
    payeer: {
        account: process.env['PAYEER_ACCOUNT']!,
        shopId: process.env['PAYEER_SHOP_ID']!,
        shopKey: process.env['PAYEER_SHOP_KEY']!,
        apiId: process.env['PAYEER_API_ID']!,
        apiPass: process.env['PAYEER_API_PASSWORD']!,
        redirectUrl: process.env['PAYEER_REDIRECT_URL']!,
        hookUrl: process.env['PAYEER_HOOK_URL']!,
    },
    preferences: Preferences.get(),
    flow: {
        identifier: 'GGNFTBOX',
        chain: process.env['FLOW_CHAIN']!,
        limit: Number(process.env['FLOW_LIMIT']) || 1000,
        admin: {
            address: process.env['FLOW_ACC_ADDRESS']!,
            privateKey: process.env['FLOW_PRIVATE_KEY']!,
            maxPubKeyIx: Number(process.env['FLOW_MAX_PUB_KEY_IX']) || 0
        },
    },
    pinata: {
        apiKey: process.env['PINATA_KEY']!,
        apiSecret: process.env['PINATA_SECRET']!,
        gatewayUrl: process.env['PINATA_GATEWAY_URL']!,
    },
    graffle: {
        companyId: process.env['GRAFFLE_COMPANY_ID']!,
        base64Secret: process.env['GRAFFLE_SECRET_BASE64']!,
    },
}

export default (): Config => config
