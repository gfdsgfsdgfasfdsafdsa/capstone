const userRole = {
    SCHOOLADMIN: 'fdsahfdsbb',
    STUDENT: 'fdlsajfsdaa',
    ADMIN: 'admin',
}

const getRole = (role)=> {
    if(role === 0) return userRole.ADMIN
    if(role === 1) return userRole.SCHOOLADMIN
    if(role === 2) return userRole.STUDENT
    
    return false;
}


export { userRole, getRole } 
