import { Expose } from 'class-transformer'


export class PaymentLink {
    @Expose()
    link: string
}
