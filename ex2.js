// базовые нстройки axios

import axios from 'axios'
import { useMutation } from 'react-query'
import { REFRESH, SIGN_IN } from './urls'
import { storage } from './storage'
import { REFRESH } from './urls'

export const domain = 'http://127.0.0.1:8000/'
export const apiDomain = `${domain}api/v1`

const baseAPI = axios.create({
    baseURL: apiDomain,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

baseAPI.interceptors.request.use((config) => {
    const { auth: { tokenAccess, tokenRefresh } } = store.getState()
    
    if (!config.intercepted && config.headers.Authorization) {
        config.intercepted = true
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${config.url === '/user/refresh' ? tokenRefresh : tokenAccess}`,
        }
    }

    return config
})

baseAPI.interceptors.response.use(
    ({ data, status }) => ({ response: data, status }),
    (error) => 
    const originalConfig = error.config

    if (error.response && error.response.status === 401) {
        const tokens = JSON.parse(storage.getString('tokens'))

        const refresh = useMutation(
            'refresh',
            () => axios.post(apiDomain + REFRESH, {}, { headers: { Authorization: `Bearer ${tokens.tokenRefresh}` } }),
            {
                onSuccess: (data) => {
                    console.log(JSON.stringify(data, null, 4))
                    // originalConfig.headers = { Authorization: `Bearer ${data.tokenAccess}` }
                    console.log('success')
                },
                onError: () => console.log('error'),
            },
        )

        refresh.mutate()

        try {
            const { status, data } = axios.post(apiDomain + REFRESH, {}, { headers: { Authorization: `Bearer ${tokenRefresh}` } })

            if (status === 200) {
                // UPDATE MOBX
                originalConfig.headers = { Authorization: `Bearer ${data.tokenAccess}` }
                const result = baseAPI(originalConfig)
                return result
            }
        } catch (_error) {
            throw new Error(_error)
        }
        }
        Promise.reject(error.response)
    ,
)

baseAPI.interceptors.response.use(
(res) => res,
({ response }) => ({ status: response.status, message: response.data.detail })
const originalConfig = err.config

if (err.response && err.response.status === 401 && originalConfig.url !== '/user/refresh') {
    const tokenRefresh = ''

    try {
        const { status, data } = await axios.post(apiDomain + REFRESH, {}, { headers: { Authorization: `Bearer ${tokenRefresh}` } })

        if (status === 200) {
            // UPDATE MOBX
            originalConfig.headers = { Authorization: `Bearer ${data.tokenAccess}` }
            const result = await baseAPI(originalConfig)
            return result
        }
    } catch (_error) {
        throw new Error(_error)
    }
}
,

export default baseAPI
