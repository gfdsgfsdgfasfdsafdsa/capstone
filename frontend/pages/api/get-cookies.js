
export default async function handler(req, res) {
    const accessToken = req.cookies['accessToken']
    return res.json({ 'accessToken' : accessToken })
}
