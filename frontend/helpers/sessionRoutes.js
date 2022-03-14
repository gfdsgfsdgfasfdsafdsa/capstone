import route from '../config/route'
import { userRole } from '../config/userRole'

const sessionRoutes = (role, path) => {
    const admin = route.admin
    const schoolAdmin = route.school
    const student = route.student
    
    let redirectPath = false
    
    if(userRole.STUDENT === role && !student.includes(path))
        redirectPath = student[0]
    else if(userRole.SCHOOLADMIN === role && !schoolAdmin.includes(path)) 
        redirectPath = schoolAdmin[0]
    else if(userRole.ADMIN === role && !admin.includes(path)) 
        redirectPath = admin[0]
    
    return redirectPath
}

export default sessionRoutes

