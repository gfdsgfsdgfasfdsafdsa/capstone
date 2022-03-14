import axios from 'axios'
import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'
import { DateTime } from "luxon";

const baseURL = process.env.api

const axiosInstance = axios.create({
    baseURL,
    //timeout: 5000,
    headers: {
        'Authorization': `Bearer ${Cookies.get('accessToken')}`,
        'Content-type': 'application/json',
    },
})

const forceLogout = (force = false) => {
    if (Cookies.get('accessToken') && !force)
        return

    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    window.location.href = '/'

}

//remove cookies when tab is closed
// if (typeof window !== 'undefined') {
//     window.onbeforeunload = function() {
//         forceLogout(true)
//     }
// }
//
axiosInstance.interceptors.request.use(
    async (req) => {

        const now = DateTime.local().setZone('Asia/Shanghai').ts


        // req.defaults.headers['Authorization'] = `Bearer ${Cookies.get('accessToken')}`
        const decodedAccess = jwt_decode(Cookies.get('accessToken')).exp

        const isExpired = (DateTime.fromSeconds(decodedAccess, { zone: 'Asia/Shanghai' }).ts - now) < 1

        // const isExpired = dayjs.unix(decodedAccess).diff(dayjs())

        // console.log('django', dayjs.unix(decodedAccess.exp))
        // console.log('dayjs', dayjs())

        if (!isExpired) return req

        const response = await axios.post(`${baseURL}/accounts/token/refresh/`, {
            refresh: Cookies.get('refreshToken')
        })

        const accessToken = response.data?.access
        // console.log(response.data?.access)
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`
        // document.cookie = 'accessToken' + "=" + response.data?.access;
        // window.localStorage.setItem('token', response.data.access)
        Cookies.set('accessToken', accessToken)
        req.headers.Authorization = `Bearer ${accessToken}`


        return req;
    }
);

//axiosInstance.interceptors.response.use(
//    (response) => {

//        return response;
//    },
//    async (error) => {
//        if (error.response.status !== 401)
//            return

//        //Getting new access token by sending refresh token
//        return axios.post(baseURL + '/accounts/token/refresh/',
//            { refresh: Cookies.get('refreshToken') })
//            .then((response) => {
//                let access = response.data.access
//                axiosInstance.defaults.headers['Authorization'] = `Bearer ${access}`
//                Cookies.set('accessToken', access)

//                //Return Original Request
//                error.response.config.headers['Authorization'] = `Bearer ${access}`;
//                return axios(error.response.config);
//            }).catch((error) => {
//                if (error.response.status === 401) {
//                    forceLogout(true)
//                    return Promise.reject(error)
//                }
//                return Promise.reject(error);
//            })
//    }
//)

export default axiosInstance
