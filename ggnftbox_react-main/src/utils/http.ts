import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiSource } from './api'


enum StatusCode {
    Unauthorized = 401,
    Forbidden = 403,
    TooManyRequests = 429,
    InternalServerError = 500,
}


const headers: Readonly<Record<string, string | boolean>> = {
    Accept: 'application/json, text/plain, */*',
}

// We can use the following function to inject the JWT token through an interceptor
// We get the `accessToken` from the localStorage that we set when we authenticate
const injectToken = (config: AxiosRequestConfig): AxiosRequestConfig => {
    try {
        const token = localStorage.getItem('accessToken')

        if (token != null && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    } catch (error) {
        throw new Error(error)
    }
}


class Http {
    private instance: AxiosInstance | null = null

    private get http(): AxiosInstance {
        return this.instance != null ? this.instance : this.initHttp()
    }

    initHttp() {
        const http = axios.create({
            baseURL: ApiSource,
            headers,
            withCredentials: true,
        })

        http.interceptors.request.use(injectToken, async (error) => Promise.reject(error))

        http.interceptors.response.use(
            (response) => response,
            async (error) => {
                const { response } = error
                return this.handleError(response)
            },
        )

        this.instance = http
        return http
    }

    async request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
        return this.http.request(config)
    }

    async get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.http.get<T, R>(url, config)
    }

    async post<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<R> {
        return this.http.post<T, R>(url, data, config)
    }

    async patch<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<R> {
        return this.http.patch<T, R>(url, data, config)
    }

    async put<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig,
    ): Promise<R> {
        return this.http.put<T, R>(url, data, config)
    }

    async delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.http.delete<T, R>(url, config)
    }

    // Handle global app errors

    getCookie = (cname: string): string => {
        const cookies = ` ${document.cookie}`.split(';')
        const val = ''
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=')
            if (cookie[0] == ` ${cname}`) {
                return cookie[1]
            }
        }
        return ''
    }

    // We can handle generic app errors depending on the status code
    private async handleError(error) {
        const { status } = error

        switch (status) {
            case StatusCode.InternalServerError: {
                // Handle InternalServerError
                break
            }
            case StatusCode.Forbidden: {
                // Handle Forbidden
                break
            }
            case StatusCode.Unauthorized: {
                // Handle Unauthorized
                break
            }
            case StatusCode.TooManyRequests: {
                // Handle TooManyRequests
                break
            }
        }

        return Promise.reject(error)
    }
}


export const http = new Http()

// async function f() {
//     console.log('== START ==')
//     const t = await http.get(API_URL + '/collections')
//     console.log(t)
//     console.log('== STOP ==')
// }
//
// f()