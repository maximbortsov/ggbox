import { TransactionType } from '../utils/enums'


export class UserTransaction {
    id: string
    type: TransactionType
    amount: string
    date: Date
}