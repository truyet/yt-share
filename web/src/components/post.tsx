"use client"

import { ThumbsDown, ThumbsUp } from "lucide-react";

import { Input } from "./ui/input";
import Link from "next/link";
import { useToast } from "./ui/use-toast";
import { Post as PostEnt } from "@/pages/api/posts/entities";

type PostProps = {
  post: PostEnt,
  profile: any
}


export const Post = ({post, profile}: PostProps) => {
  const { toast } = useToast() 

  const getThumbnail = (thumbnails: string) => {
    const thumbs = JSON.parse(thumbnails)
    return thumbs.medium?.url
  }
  
  const interact = async (id: number, type: string) => {
    const resp = await fetch('/api/posts/interact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id }),
    })
    if (resp.ok) {
      if (post.userInteraction === type) {
        post.userInteraction = ''
      } else {
        post.userInteraction = type
      }
      toast({
        title: "Success",
        // description: (
        //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //     <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //   </pre>
        // ),
      })}
  }

  const getInteration = (userInteraction: string) => {
    // console.log('owner', profile, post)
    if (!profile || profile?.id === post.authorId) {
      return <></>
    }
    if (!userInteraction) {
      return <><ThumbsUp size={32} onClick={() => interact(post.id, 'LIKE')}/><ThumbsDown size={32} onClick={() => interact(post.id, 'DISLIKE')} /></>
    }

    if (userInteraction === 'LIKE') {
      return <ThumbsUp size={32} fill="gray" onClick={() => interact(post.id, 'LIKE')} />
    }

    if (userInteraction === 'DISLIKE') {
      return <ThumbsDown size={32} fill="gray" onClick={() => interact(post.id, 'DISLIKE')} />
    }

  }

  return (
    <>
        <div className="flex space-x-4 justify-start w-full p-4">
        <img className="object-contain" src={getThumbnail(post.thumbnails)} alt="thumb"></img>
          <div className="flex-col justify-start w-full">
            <div className="flex flex-row justify-between items-center">
              <div className="flex-col">
                <h3 className="text-lg">
                  <Link href={post.videoUrl} target="_blank">{ post.title }</Link>
                </h3>
                <p className="text-sm py-1">
                  Share by: { post.author?.email }
                </p>
              </div>
              <div className="flex space-x-2">
                { getInteration(post.userInteraction)}
              </div>
            </div>
            <div className="flex text-sm py-1 space-x-4">
              <div className="flex space-x-1 items-center">
                <span className="text-md">{ post.likeCount }</span>
                <ThumbsUp size={16} />
              </div>
              <div className="flex space-x-1 items-center">
                <span className="text-md">{ post.dislikeCount }</span>
                <ThumbsDown size={16} />
              </div>
            </div>
            <h4>
              Description
            </h4>
            <p className="text-sm text-left text-muted-foreground text-wrap">
              { post.description ? (post.description.length > 350 ? post.description.substring(0, 350) + ' ...' : post.description) : '' }
            </p>
          </div>
        </div>
    </>

  )
}