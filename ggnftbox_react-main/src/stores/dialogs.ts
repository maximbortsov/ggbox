import { makeAutoObservable } from 'mobx'


interface ConfirmationDialog {
    isOpen: boolean
    handleConfirm(): void
    handleClose(): void
    handleOpen(): void
}


export class ConfirmCancelLotStore implements ConfirmationDialog {

    isOpen = false

    constructor() {
        makeAutoObservable(this)
    }

    handleConfirm = (): void => {
        console.log('confirmed')
        this.handleClose()
    }

    handleClose = (): void => {
        this.isOpen = false
    }

    handleOpen = (): void => {
        this.isOpen = true
    }

}


export class SuccessfulPaymentStore implements ConfirmationDialog {
    isOpen = false

    constructor() {
        makeAutoObservable(this)
    }

    handleConfirm = (): void => {
        console.log('continued')
        this.handleClose()
    }

    handleClose = (): void => {
        this.isOpen = false
    }

    handleOpen = (): void => {
        this.isOpen = true
    }
}


export class FailedPaymentStore implements ConfirmationDialog {
    isOpen = false

    constructor() {
        makeAutoObservable(this)
    }

    handleConfirm = (): void => {
        console.log('triedAgain')
        this.handleClose()
    }

    handleClose = (): void => {
        this.isOpen = false
    }

    handleOpen = (): void => {
        this.isOpen = true
    }
}