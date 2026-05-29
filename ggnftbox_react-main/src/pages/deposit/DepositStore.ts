import { makeAutoObservable } from 'mobx'


class DepositStore {

    constructor() {
        makeAutoObservable(this)
    }
}


export default DepositStore
