// функции для auth

import { useMutation } from 'react-query'
import { useNavigation } from '@react-navigation/native'
import baseAPI from './axios'
import { SIGN_IN, SIGN_UP } from './urls'
import { setUser } from './storage'

export function useRegistrationRequest() {
    const registration = useMutation('registration', (data) => baseAPI.post(SIGN_UP, data))

    if (registration.isSuccess) {
        setUser(registration.data.response)
    }

    if (registration.isError) {
        registration.error = { data: registration.error.response.data }
    }

    return registration
}

export function useLoginRequest() {
    const { reset } = useNavigation()
    const loginMutation = useMutation('login', (data) => baseAPI.post(SIGN_IN, data))

    if (loginMutation.isSuccess) {
        setUser(loginMutation.data.response)
        reset({ index: 0, routes: [{ name: 'Home' }] })
    }

    if (loginMutation.isError) {
        loginMutation.error = { data: loginMutation.error.data }
    }

    return loginMutation
}
