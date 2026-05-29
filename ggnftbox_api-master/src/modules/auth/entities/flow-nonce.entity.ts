import { Expose } from 'class-transformer'


export class FlowNonce {

    @Expose()
    nonce: string
}
