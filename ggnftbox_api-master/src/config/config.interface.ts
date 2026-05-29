import { Preferences } from './preferences'


export interface Config {
    nest: NestConfig
    cors: CorsConfig
    security: SecurityConfig
    assets: AssetsConfig
    email: EmailConfig
    emailSecurity: EmailSecurityConfig
    payeer: PayeerConfig
    preferences: Preferences
    flow: FlowConfig
    pinata: PinataConfig
    graffle: GraffleConfig
}


export interface NestConfig {
    port: number
    domain: string
    protocol: string
}


export interface CorsConfig {
    enabled: boolean
}


export interface SecurityConfig {
    accessKey: string
    refreshKey: string
    expiresIn: string
    refreshIn: string
    bcryptRounds: number
}


export interface AssetsConfig {
    dir: string
    maxSize: number
}


export interface EmailConfig {
    debug: boolean
    host: string
    port: number
    user: string
    password: string
    redirectUrl: string
}


export interface EmailSecurityConfig {
    secret: string
    expiresIn: string
}


export interface PayeerConfig {
    account: string
    shopId: string
    shopKey: string
    apiId: string
    apiPass: string
    // URL with last query param (boolean)
    redirectUrl: string
    hookUrl: string
}


export interface FlowConfig {
    identifier: string
    chain: string
    limit: number
    admin: {
        address: string
        privateKey: string
        maxPubKeyIx: number
    }
}


export interface PinataConfig {
    apiKey: string
    apiSecret: string
    gatewayUrl: string
}


export interface GraffleConfig {
    companyId: string
    base64Secret: string
}
