import MainStore from '../pages/main/MainStore'
import AppBarStore from '../components/appbar/AppBarStore'
import MarketplaceStore from '../pages/marketplace/MarketplaceStore'
import AboutUsStore from '../pages/aboutUs/AbousUsStore'
import BoxesStore from '../pages/boxes/BoxesStore'
import AuthStore from '../pages/auth/AuthStore'
import SignUpStore from '../pages/signUp/SignUpStore'
import ProfileStore from '../pages/profile/ProfileStore'
import ResetPasswordStore from '../pages/resetPassword/ResetPasswordStore'
import { ConfirmCancelLotStore, FailedPaymentStore, SuccessfulPaymentStore } from './dialogs'
import TokenStore from './TokenStore'
import AdminPanelStore from '../pages/adminPanel/AdminPanelStore'
import GGSnackbarStore from './GGSnackbarStore'


export class RootStore {
    // pages
    readonly main = new MainStore()
    readonly appBar = new AppBarStore()
    readonly auth = new AuthStore()
    readonly signUp = new SignUpStore()
    readonly marketplace = new MarketplaceStore()
    readonly aboutUs = new AboutUsStore()
    readonly boxes = new BoxesStore()
    readonly profile = new ProfileStore()
    readonly resetPassword = new ResetPasswordStore()

    // dialogs
    readonly confirmCancelLotStore = new ConfirmCancelLotStore()
    readonly successfulPaymentStore = new SuccessfulPaymentStore()
    readonly failedPaymentStore = new FailedPaymentStore()

    // admin panel
    readonly admin = new AdminPanelStore()

    //tokens
    readonly tokenStore = new TokenStore()

    // snackbars
    readonly snackbars = new GGSnackbarStore()

}


const stores: RootStore = new RootStore()
export default stores
