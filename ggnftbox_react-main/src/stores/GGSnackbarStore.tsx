import { makeAutoObservable } from 'mobx'
import { SnackbarType } from '../utils/enums'


class GGSnackbarStore {

    isShown = false
    message = ''
    type = SnackbarType.SUCCESS

    constructor() {
        makeAutoObservable(this)
    }

    showErrorSnackbar = (message: string): void => {
        this.message = message
        this.type = SnackbarType.ERROR
        this.isShown = true
    }

    showSuccessSnackbar = (message: string): void => {
        this.message = message
        this.type = SnackbarType.SUCCESS
        this.isShown = true
    }

    showInfoSnackbar = (message: string): void => {
        this.message = message
        this.type = SnackbarType.INFO
        this.isShown = true
    }

    showWarningSnackbar = (message: string): void => {
        this.message = message
        this.type = SnackbarType.WARNING
        this.isShown = true
    }

    showProgressSnackbar = (message?: string): void => {
        this.message = message ? message : 'Loading...'
        this.type = SnackbarType.LOADING
        this.isShown = true
    }

    closeSnackbar = (): void => {
        this.isShown = false
    }
}


export default GGSnackbarStore