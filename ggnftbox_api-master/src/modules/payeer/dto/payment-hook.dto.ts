import { Expose } from 'class-transformer'


export class PaymentHookDto {

    @Expose()
    m_operation_id?: string

    @Expose()
    m_operation_ps: string

    @Expose()
    m_operation_date: string

    @Expose()
    m_operation_pay_date: string

    @Expose()
    m_shop: string

    @Expose()
    m_orderid: string

    @Expose()
    m_amount: string

    @Expose()
    m_curr: string

    @Expose()
    m_desc: string

    @Expose()
    m_status: string

    @Expose()
    m_params: string

    @Expose()
    m_sign?: string
}
