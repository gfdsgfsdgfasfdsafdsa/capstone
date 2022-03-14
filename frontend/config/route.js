
//Note: First index is being use as a redirect
const route = {
    admin: ['/a', '/a/school', '/a/school/create', '/a/school/[id]', '/a/students'],
    student: ['/u', '/u/exam', '/u/exam/details/[id]', '/u/results', '/u/results/[id]', '/u/account'],
    school: ['/s', '/s/exam', '/s/results',
        '/s/results/[id]','/s/applied', '/s/account'],
}

export default route
