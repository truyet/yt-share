import type { NextApiRequest, NextApiResponse } from 'next'
import { Post } from './entities'
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[]>
) {
  
  if (req.method === "GET") {
    const token = req.cookies['token']
    const apiResp = await fetch('http://post-service:3000/posts/latest', {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    })
    
    if (apiResp.ok) {
      const posts = await apiResp.json()
      const userIds = new Map(posts.map((p: any) => [p.authorId, true]))
      // console.log(userIds.keys())
      const usersResp = await fetch('http://auth-service:3000/users/ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ids: Array.from(userIds.keys())})
      })
      if (usersResp.ok) {
        const users = await usersResp.json().then(it => new Map(it.map((u: any) => [u.id, u])))
        posts.forEach((p: any) => {
          p.author = users.get(p.authorId)
        })
      }
      res.status(200).json(posts)
    } else {
      res.status(apiResp.status).json(await apiResp.json())
    }
    return
  }

  res.status(405).json([])
}