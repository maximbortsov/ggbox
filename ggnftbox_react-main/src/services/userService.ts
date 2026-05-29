import { ApiSource } from '../utils/api'
import { http } from '../utils/http'
import stores from '../stores/Stores'


const getProfileInfo = async () => {
    const response = await http.get(ApiSource + 'user/me')
    const data = await response.data
    if (response.statusText === 'OK') {
        return data
    } else if (response.status === 401) {
        return data
    } else {
        return Promise.reject(new Error('Profile data handle error: ' + (data.errors?.map((e: Error) => e.message).join('\n') ?? 'unknown')))
    }
}

const updateUserData = (username?: string, password?: string): void => {
    stores.snackbars.showProgressSnackbar()
    if (username) {
        const formData = new FormData()
        formData.append('data', JSON.stringify({ username }))
        formData.append('file', '')
        http.patch(ApiSource + 'user', formData)
            .then(() => stores.snackbars.showSuccessSnackbar('Success!'))
            .catch((e) => stores.snackbars.showErrorSnackbar(e.data))
    }

    if (password) {
        http.patch(ApiSource + 'user/change-password', { password: password })
            .then(() => stores.snackbars.showSuccessSnackbar('Success!'))
            .catch((e) => stores.snackbars.showErrorSnackbar(e.data))
    }
}

export { getProfileInfo, updateUserData }
