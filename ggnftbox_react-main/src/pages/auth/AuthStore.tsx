import { makeAutoObservable } from 'mobx'
import stores from '../../stores/Stores'


class AuthStore {

    email = ''
    password = ''

    constructor() {
        makeAutoObservable(this)
    }

    updateEmail = (email: string): void => {
        this.email = email
    }

    updatePassword = (password: string): void => {
        this.password = password
    }

    signIn = (): void => {
        stores.appBar.authorize()
    }

}


export default AuthStore
