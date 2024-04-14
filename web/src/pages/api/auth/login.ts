import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from "cookie";
 
type ResponseData = {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData|any>
) {
  
  if (req.method === "POST") {
    const { email, password } = req.body
    const apiResp = await fetch('http://auth-service:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (apiResp.ok) {
      const { access_token, expires_in } = await apiResp.json()
      const timeInSecs = new Date().getTime() + ((expires_in - 600) * 1000)
      const expire = new Date(timeInSecs)
      res.setHeader('Set-Cookie', cookie.serialize('token', access_token, {expires: expire, httpOnly: true, path: '/'}))
      res.status(200).json({message: "Success"})
      return
    } else {
      res.status(400).json({ message: 'INVALID_INPUT' })
    }
    return
  }

  res.status(405).send('')
}