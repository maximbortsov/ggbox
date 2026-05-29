import * as pinataSDK from '@pinata/sdk'
import { PinataClient, PinataPinOptions, PinataPinResponse } from '@pinata/sdk'
import { Readable } from 'stream'
import { ConfigService } from '@nestjs/config'
import { PinataConfig } from '../../config/config.interface'
import { Injectable } from '@nestjs/common'
import * as path from 'path'


@Injectable()
export class PinataService {

    private readonly pinata: PinataClient

    constructor(
        private readonly configService: ConfigService,
    ) {
        const pinataService = configService.getOrThrow<PinataConfig>('pinata')
        // @ts-expect-error TypeScript doesn't recognize module
        this.pinata = pinataSDK(pinataService.apiKey, pinataService.apiSecret)
    }

    async pinFile(content: Buffer, filename: string, metadata: { name: string; [key: string]: string }): Promise<PinataPinResponse> {
        // Read buffer into readable stream
        const contentStream = Readable.from(content)

        // Hack for Pinata. Pinata requires a file name
        contentStream['path'] = filename

        // Create options
        const options: PinataPinOptions = {
            pinataMetadata: metadata,
            pinataOptions: {
                cidVersion: 1,
            },
        }

        return this.pinata.pinFileToIPFS(contentStream, options)
    }

    static getPinataGatewayURL(cid: string, gatewayUrl: string): string {
        return new URL(path.join('ipfs', cid), gatewayUrl).href
    }
}
