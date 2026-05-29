import stores from '../stores/Stores'


function logout(): void {
    stores.tokenStore.updateAccessToken('')
}

export { logout }
