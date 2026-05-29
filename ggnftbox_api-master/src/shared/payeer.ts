import { stringify, unescape } from 'querystring'
import { Money } from 'ts-money'
import { AxiosRequestHeaders, default as axios } from 'axios'
import { createCipheriv, createHash } from 'crypto'


export interface PaymentData {
    m_operation_id?: string
    m_operation_ps: string
    m_operation_date: string
    m_operation_pay_date: string
    m_shop: string
    m_orderid: string
    m_amount?: string
    m_curr: string
    m_desc: string
    m_status: string
    m_params?: string
    m_sign?: string
}


export interface ExtraPayeerParams {
    success_url?: string
    fail_url?: string
    status_url?: string
    reference?: Record<string, string>
    submerchant?: string
}


export interface PaymentCallback {
    orderId: string
    success: boolean
    amountPaid: Money
}


export interface ErrorResponse {
    auth_error: '0' | '1'
    errors: string[]
}


export interface InvoiceCreateResponse extends ErrorResponse {
    success: boolean
    url: string
}


export interface MerchantResponse extends ErrorResponse {
    location: string
    orderid: number
    historyid: number
    historytm: number
}


export class Requests {

    protected readonly accountData: string
    private readonly api: string
    private readonly headers: AxiosRequestHeaders

    constructor() {
        this.accountData = ''
        this.api = 'https://payeer.com/ajax/api/api.php'
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }

    async request(url: string, action: string): Promise<any> {

        const result = await axios.post(
            this.api + url,
            this.accountData + action,
            { headers: this.headers },
        )

        return result.data
    }

    stringifyParams(params: Record<string, string>): string {
        return stringify(params, undefined, undefined, { encodeURIComponent: unescape })
    }
}


export class Payeer extends Requests {

    protected readonly accountData: string
    private readonly account: string
    private readonly apiId: string
    private readonly apiPass: string

    constructor(account: string, apiId: string, apiPass: string) {
        super()
        this.account = account
        this.apiId = apiId
        this.apiPass = apiPass
        this.accountData = `account=${this.account}&apiId=${this.apiId}&apiPass=${this.apiPass}&`
    }

    async AuthorizationCheck(): Promise<any> {
        return this.request('', '')
    }

    async getBalance(): Promise<any> {
        return this.request('?getBalance', '&action=getBalance')
    }

    async transfer(curIn: string, sum: number, curOut: string, to: string): Promise<any> {
        return this.request('?transfer', `&action=transfer&curIn=${curIn}&sum=${sum}&curOut=${curOut}&to=${to}`)
    }

    async checkUser(user: string): Promise<any> {
        return this.request('?checkUser', `&action=checkUser&user=${user}`)
    }

    async getExchangeRate(output: 'N' | 'Y'): Promise<any> {
        return this.request('?getExchangeRate', `&action=getExchangeRate&output=${output}`)
    }

    async payoutChecking(payoutId: string, sumIn: number, curIn: string, curOut: string, accountNumber: string): Promise<any> {
        return this.request(
            '?payoutChecking',
            `&action=payoutChecking&ps=${payoutId}&sumIn=${sumIn}&curIn=${curIn}&curOut=${curOut}&param_ACCOUNT_NUMBER=${accountNumber}`,
        )
    }

    async payout(payoutId: string, sumIn: number, curIn: string, curOut: string, accountNumber: string): Promise<any> {
        return this.request(
            '?payout',
            `&action=payout&ps=${payoutId}&sumIn=${sumIn}&curIn=${curIn}&curOut=${curOut}&param_ACCOUNT_NUMBER=${accountNumber}`,
        )
    }

    async getPaySystems(): Promise<any> {
        return this.request('?getPaySystems', `&action=getPaySystems`)
    }

    async paymentDetails(merchantId: string, referenceId: string): Promise<any> {
        return this.request('?paymentDetails', `&action=paymentDetails&merchantId=${merchantId}&referenceId=${referenceId}`)
    }

    async history(): Promise<any> {
        return this.request('?history', `&action=history`)
    }

    async payoutDetails(referenceId: string): Promise<any> {
        return this.request('?payoutDetails', `&action=payoutDetails&referenceId=${referenceId}`)
    }

    async invoiceCreate(shopId: string, orderId: string, price: Money, desc?: string): Promise<InvoiceCreateResponse> {
        const params = {
            action: 'invoiceCreate',
            m_shop: shopId,
            m_orderid: orderId,
            m_amount: price.toString(),
            m_curr: price.currency,
            m_desc: encodeURI(desc ? desc : `ORDER ID: ${orderId}`),
        }

        return this.request('?invoiceCreate', this.stringifyParams(params))
    }

    async merchant(orderId: string, amount: Money, shopId: string, shopKey: string, desc?: string): Promise<MerchantResponse> {
        const description = base64encode(desc ? desc : `ORDER ID: ${orderId}`)

        const hash = [shopId, orderId, amount.toString(), amount.currency, description, shopKey]
        const sign = sha256(hash.join(':')).toUpperCase()

        const params = {
            action: 'merchant',
            lang: 'en',
            shop: JSON.stringify({
                m_shop: shopId,
                m_orderid: orderId,
                m_amount: amount.toString(),
                m_curr: amount.currency,
                m_desc: description,
                m_sign: sign,
            }),
            ps: JSON.stringify({
                id: '2609',
                curr: amount.currency,
            }),
            form: JSON.stringify({
                order_email: 'simraki@mail.ru',
            }),
        }

        return this.request('?merchant', this.stringifyParams(params))
    }

    private static hashExtraParams(extra: ExtraPayeerParams, shopKey: string, orderId: string): string {
        const key = md5(shopKey + '' + orderId)
        const strParams = JSON.stringify(extra).replace(/\//g, '\\/')
        return encodeURIComponent(aes256cbc(strParams, key))
    }

    offlineMerchantLink(orderId: string, amount: Money, shopId: string, shopKey: string, desc?: string, extraParams?: ExtraPayeerParams): string {
        desc = base64encode(desc ? desc : `ORDER ID: ${orderId}`)

        const hash = [shopId, orderId, amount.toString(), amount.currency, desc]

        let m_params: string | undefined
        if (extraParams) {
            m_params = Payeer.hashExtraParams(extraParams, shopKey, orderId)
            hash.push(m_params)
        }
        hash.push(shopKey)

        const sign = sha256(hash.join(':')).toUpperCase()

        const shopParams = {
            m_shop: shopId,
            m_orderid: orderId,
            m_amount: amount.toString(),
            m_curr: amount.currency,
            m_desc: desc,
            m_sign: sign,
        }
        if (extraParams) {
            shopParams['m_params'] = m_params
            shopParams['m_cipher_method'] = 'AES-256-CBC-IV'
        }

        return 'https://payeer.com/merchant/?' + new URLSearchParams(shopParams).toString()
    }

    parsePaymentCallback(data: PaymentData, shopKey: string): PaymentCallback {
        if (!data.m_operation_id || !data.m_sign) {
            return {
                success: false,
                orderId: data.m_orderid,
                amountPaid: Money.fromInteger(0, data.m_curr),
            }
        }
        const callbackHash = [
            data.m_operation_id,
            data.m_operation_ps,
            data.m_operation_date,
            data.m_operation_pay_date,
            data.m_shop,
            data.m_orderid,
            data.m_amount,
            data.m_curr,
            data.m_desc,
            data.m_status,
        ]

        if (data.m_params) {
            callbackHash.push(data.m_params)
        }

        callbackHash.push(shopKey)

        const validSign = sha256(callbackHash.join(':')).toUpperCase()
        console.log(validSign)
        const isSignValid = data.m_sign === validSign
        console.log(isSignValid)
        const isPaymentSuccess = isSignValid && data.m_status === 'success'
        console.log(isPaymentSuccess)

        const amountPaid = data.m_amount !== undefined
            ? Money.fromDecimal(Number(data.m_amount), data.m_curr)
            : Money.fromInteger(0, data.m_curr)

        return {
            success: isPaymentSuccess,
            orderId: data.m_orderid,
            amountPaid: amountPaid,
        }
    }
}


export const sha256 = (data: string): string => createHash('sha256').update(data).digest('hex')
export const base64encode = (data: string): string => Buffer.from(data).toString('base64')
export const md5 = (data: string): string => createHash('md5').update(data).digest('hex')
export const aes256cbc = (data: string, md5key: string): string => {
    const iv = sha256(md5key).slice(0, 16)
    const encrypter = createCipheriv('aes-256-cbc', md5key, iv)
    return encrypter.update(data, 'utf8', 'base64') + encrypter.final('base64')
}
