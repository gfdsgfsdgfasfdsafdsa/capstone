import { userRole, route } from './index'
import Cookies from 'js-cookie'
import handleRouteId from '../helpers/handleRouteId'
import {
    Dashboard,
    ReceiptLong,
    HistoryEdu,
    Quiz,
    ManageAccounts,
    People,
} from '@mui/icons-material';

const setRoutes = () => {
    const user = Cookies.get(process.env.userRole)
    let userRoutes = []
    let icon = []
    let title = []

    if (userRole.ADMIN === user) {
        icon = [<Dashboard />, <People />, <People />]
        title = ['Dashboard', 'School', 'Students']
        let c = 0
        for (let i = 0; i < route.admin.length; i++) {
            const r = handleRouteId(route.admin[i]) === route.admin[i]
                ? route.admin[i] : false
            if(!r) continue
            userRoutes.push({
                url: r,
                title: title[c],
                icon: icon[c],
                i: 3
            })
            c++;
        }
    } else if (userRole.SCHOOLADMIN === user) {
        icon = [<Dashboard/>, <ReceiptLong/>, <HistoryEdu/>,
            <People/>, <ManageAccounts/>]
        title = ['Dashboard', 'Exam', 'Results','Student Applied', 'Account']
        let c = 0
        for (let i = 0; i < route.school.length; i++) {
            const r = handleRouteId(route.school[i]) === route.school[i]
                ? route.school[i] : false
            if(!r) continue
            userRoutes.push({
                url: r,
                title: title[c],
                icon: icon[c],
                i: 4
            })
            c++;
        }
    } else if (userRole.STUDENT === user) {
        icon = [<Dashboard />, <ReceiptLong />, <ReceiptLong />, <ManageAccounts/>]
        title = ['Dashboard', 'Exam', 'Results', 'Account']
        let c = 0
        for (let i = 0; i < route.school.length; i++) {
            const r = handleRouteId(route.student[i]) === route.student[i]
                ? route.student[i] : false
            if(!r) continue
            userRoutes.push({
                url: r,
                title: title[c],
                icon: icon[c],
                i: 3
            })
            c++;
        }
    }

    return userRoutes
}

export default setRoutes
