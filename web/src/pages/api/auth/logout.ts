import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from "cookie";
 
type ResponseData = {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData|any>
) {
    const expire = new Date()
    res.setHeader('Set-Cookie', cookie.serialize('token', '', {expires: expire, httpOnly: true, path: '/'}))
    res.status(200).json({message: "Success"})
    return
}