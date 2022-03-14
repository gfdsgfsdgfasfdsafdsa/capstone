import { NextResponse } from 'next/server'
import sessionRoutes from '../../helpers/sessionRoutes'
import handleRouteId from '../../helpers/handleRouteId'

export function middleware(req) {

    let res = NextResponse.next()

    const isAuth = req.cookies['refreshToken']
    const userRole = req.cookies[process.env.userRole]

    const url = req.nextUrl.clone()
    url.pathname = '/'

    if (!isAuth)
        return NextResponse.redirect(url)
    else {
        const redirect = sessionRoutes(userRole, handleRouteId(req.nextUrl.pathname))
        //recommeded way: modified based on docs
        if (redirect){
            url.pathname = redirect
            return NextResponse.redirect(url)
        }
    }

    return res
}
