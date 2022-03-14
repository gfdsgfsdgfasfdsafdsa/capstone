import axios from 'axios'

export default async function handler(req, res) {
    const accessToken = req.cookies['accessToken']
    let responseData = []
    try{
        const { data } = await axios.get(`${process.env.api}/school/exam/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        responseData = data
    } finally {
        return res.json(responseData)
    }
}