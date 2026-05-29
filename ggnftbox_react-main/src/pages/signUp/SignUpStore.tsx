import { makeAutoObservable } from 'mobx'


class SignUpStore {

    login = ''
    email = ''
    password = ''
    repeatPassword = ''

    constructor() {
        makeAutoObservable(this)
    }

    updateLogin = (login: string): void => {
        this.login = login
    }

    updateEmail = (email: string): void => {
        this.email = email
    }

    updatePassword = (password: string): void => {
        this.password = password
    }

    updateRepeatPassword = (repeatPassword: string): void => {
        this.repeatPassword = repeatPassword
    }

}


export default SignUpStore