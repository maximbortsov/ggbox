import { makeAutoObservable } from 'mobx'


class ResetPasswordStore {

    email = ''
    password = ''
    passwordRepeat = ''
    hint = ''

    constructor() {
        makeAutoObservable(this)
    }

    setEmail = (email: string): void => {
        this.email = email
    }

    setPassword = (password: string): void => {
        this.password = password
    }

    setPasswordRepeat = (password: string): void => {
        this.passwordRepeat = password
    }
}


export default ResetPasswordStore