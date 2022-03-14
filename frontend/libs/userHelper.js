import { userRole, route } from '../config/index'

const redirectByRole = (role) => {
    if(userRole.SCHOOLADMIN === role)
        window.location = route.school[0]
    if(userRole.STUDENT === role)
        window.location = route.student[0]
    if(userRole.ADMIN === role)
        window.location = route.admin[0]
}

export { redirectByRole }
