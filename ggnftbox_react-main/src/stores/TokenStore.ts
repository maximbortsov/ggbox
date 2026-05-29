import { makeAutoObservable } from 'mobx'


class TokenStore {

    accessToken = localStorage.getItem('accessToken')
    refreshToken = localStorage.getItem('refreshToken')

    constructor() {
        makeAutoObservable(this)
    }

    updateAccessToken = (accessToken: string): void => {
        localStorage.setItem('accessToken', accessToken)
        this.accessToken = accessToken
    }

    updateRefreshToken = (refreshToken: string): void => {
        localStorage.setItem('refreshToken', refreshToken)
        this.refreshToken = refreshToken
    }
}


export default TokenStore
