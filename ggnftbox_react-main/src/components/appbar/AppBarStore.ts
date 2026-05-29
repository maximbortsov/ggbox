import { makeAutoObservable } from 'mobx'
import { logout } from '../../services/authService'


class AppBarStore {

    isAuthorized = false
    refetchBalance = true

    constructor() {
        makeAutoObservable(this)
    }

    authorize = (): void => {
        this.isAuthorized = true
    }
    logout = (): void => {
        this.isAuthorized = false
        logout()
    }

}


export default AppBarStore

