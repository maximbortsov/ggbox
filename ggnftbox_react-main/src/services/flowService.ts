import * as fcl from '@onflow/fcl'
import { AccountIsSetup } from '../cadence/scripts/user'
import { SetupGgAccount } from '../cadence/transactions/SetupGgAccount'
import stores from '../stores/Stores'
import { GetFUSDBalance } from '../cadence/scripts/fusd'
import { http } from '../utils/http'
import { ApiSource } from '../utils/api'

// check if user's account set up for working with ggnft NFT's
export const isAuthorizedInBlocto = async (): Promise<boolean> => !!((await fcl.currentUser.snapshot()).addr)

export const accountProofResolver = async () => {
    const { nonce } = await http
        .post(ApiSource + 'auth/gen-nonce')
        .then((res) => res.data)
    console.log(nonce)
    return {
        appIdentifier: 'GGNFTBOX',
        nonce: nonce,
    }
}

export const logOutBlocto = async (): Promise<void> => {
    await fcl.currentUser.unauthenticate()
    stores.tokenStore.updateAccessToken('')
}

export const authInBlocto = async (): Promise<void> => {
    stores.snackbars.showProgressSnackbar('Communicating with Blocto...')
    const res = await fcl.authenticate()

    console.log(res)
    if (!res.addr) {
        stores.snackbars.showErrorSnackbar('Authenticating denied.')
        return
    }
    const accountProofService = res.services.find((service) => service.type === 'account-proof')

    void http
        .post(ApiSource + 'auth/login', {
            address: res.addr,
            nonce: accountProofService.data.nonce,
            signatures: accountProofService.data.signatures,
        })
        .then((res) => {
            stores.snackbars.showSuccessSnackbar('Success!')
            stores.tokenStore.updateAccessToken(res.data.accessToken)
            stores.tokenStore.updateRefreshToken(res.data.refreshToken)
        })
        .catch(() => stores.snackbars.showErrorSnackbar('Something went wrong.'))
}

// check if user's account set up for working with ggnft NFT's
export const isGgAccountSetUp = async (): Promise<boolean> => {
    const currentUser = await fcl.currentUser.snapshot()
    if (!currentUser.addr) return Promise.resolve(false)
    return await fcl.query({
        cadence: AccountIsSetup,
        args: (arg, t) => [
            arg(currentUser.addr, t.Address),
        ],
    })
}

// сетап аккаунта на фюсд и работу с ггнфт
export const setupGgAccount = async (): Promise<any> => {
    const transactionId = await fcl.mutate({
        cadence: SetupGgAccount,
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 500,
    })
    stores.snackbars.showProgressSnackbar()
    return await fcl.tx(transactionId).onceSealed()
}

// прверка аккаунта
export const checkFlowAccount = async (): Promise<void> => {
    // check if user's account can store with gg nft
    const accountSetUp = await isGgAccountSetUp()
    // if not - set up
    if (!accountSetUp) {
        await setupGgAccount()
        stores.snackbars.showSuccessSnackbar('Your Flow account has been configured to work with GGNFT!')
    }
}

export const fetchFUSDBalance = async (): Promise<number> => {
    const currentUser = await fcl.currentUser.snapshot()
    if (!currentUser.addr) return Promise.resolve(0)
    if (currentUser) {
        return Number(await fcl.query({
            cadence: GetFUSDBalance,
            args: (arg, t) => [
                arg(currentUser.addr, t.Address),
            ],
        }))
    } else return new Promise(() => 0)
}