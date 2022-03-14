import React, { createContext, useContext, useState } from "react";
import axiosInstance from '../utils/axiosInstance'
import axios from 'axios'
import Cookies from 'js-cookie'
import useSWR from 'swr'
import { redirectByRole } from './userHelper'
import { getRole } from '../config/userRole'
import { useRouter } from 'next/router';

const AuthContext = createContext({})

const userRoleKey = process.env.userRole

const AuthContextProvider = props => {
    const isAuth = Cookies.get('refreshToken')
    const [statusCode, setStatusCode] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const { data: user } = useSWR(() => Cookies.get('refreshToken') ? '/accounts/profile/' : null)

    const login = async (email, password) => {
        setIsLoading(true)

        try {
            await axios.post(process.env.api + '/accounts/token/', {
                email, password
            }).then((res) => {
                const { refresh, access, role } = res.data
                if(refresh == null && access == null && role == null){
                    setStatusCode(401)
                }else{
                    Cookies.set(userRoleKey, getRole(role), { secure: true })
                    Cookies.set('refreshToken', refresh, { secure: true })
                    Cookies.set('accessToken', access, { secure: true })

                    axiosInstance.defaults.headers['Authorization'] = `Bearer ${access}`

                    setStatusCode(200)
                    redirectByRole(getRole(role))
                }
            }).catch((error) => {
                setStatusCode(error?.response?.status)
            })
        } finally {
            setIsLoading(false)
        }

    }


    const logout = () => {
        setStatusCode(0)
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove(userRoleKey)
        window.location.href = '/'
    }
    //pass authDetails here and setAuth
    const authContextValue = {
        login,
        logout,
        isLoading,
        statusCode,
        user,
        isAuth,
        setStatusCode,
    }

    return <AuthContext.Provider value={authContextValue} {...props} />
}

const useAuth = () => useContext(AuthContext)

export { AuthContextProvider, useAuth }
