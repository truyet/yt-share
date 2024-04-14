import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  
  if (req.method === "GET") {
    const token = req.cookies['token']
    if (!token) {
      return res.status(401).send('')
    }
    const apiResp = await fetch('http://auth-service:3000/auth/profile', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    })

    if (apiResp.ok) {
      res.status(200).json(await apiResp.json())
      return
    }
  
    res.status(apiResp.status).json(await apiResp.json())
    return
  }

  res.status(405).send('')
}