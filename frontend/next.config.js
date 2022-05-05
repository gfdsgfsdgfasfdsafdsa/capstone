module.exports = {
    reactStrictMode: true,
    images: {
        domains: ['http://localhost:3000', 'res.cloudinary.com'],
        //domains: ['https://courseme.vercel.app', 'res.cloudinary.com'],
    },
    env: {
        api: 'http://127.0.0.1:8000',
        //api: 'https://backend-324.herokuapp.com',
        userRole: 'userRole',
    },
}
