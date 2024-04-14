import type { NextApiRequest, NextApiResponse } from 'next'
import { Post } from './entities'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post|string>
) {
  
  if (req.method === "POST") {
    const token = req.cookies['token']
    if (!token) {
      return res.status(401).send('')
    }

    const { id, type } = req.body
    const apiResp = await fetch(`http://post-service:3000/posts/${id}/interact`, {
      method: 'PUT',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ type })
    })

    if (apiResp.ok) {
      res.status(200).json(await apiResp.json())
    } else {
      res.status(apiResp.status).json(await apiResp.json())
    }
  
    return
  }
}