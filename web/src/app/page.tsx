'use client'
import { MainNav } from "@/components/main-nav";
import { Post } from "@/components/post";
import { SharePost } from "@/components/share-post";
import { toast, useToast } from "@/components/ui/use-toast";
import { UserLogin } from "@/components/user-login";
import { UserNav } from "@/components/user-nav";
import { UserRegister } from "@/components/user-register";
import { Post as PostEnt } from "@/pages/api/posts/entities";
import { socket } from "@/socket";
import { useEffect, useLayoutEffect, useState } from "react";

export default function Home() {
  const { toast } = useToast()

  const [posts, setPosts] = useState<PostEnt[]>()
  const [profile, setProfile] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (!posts) {
      getPosts()
      getProfile()
    }
  }, [posts])

  const getPosts = async () => {
    const resp = await fetch('/api/posts/latest', { method: 'GET' })
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!resp.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }

    resp.json().then(posts => {
      // console.log(posts)
      setPosts(posts)
    })
  }

  const getProfile = async () => {
    const resp = await fetch('/api/auth/profile')
    if (resp.ok) {    
      resp.json().then(profile => setProfile(profile))
    }
  }

  const clearProfile = async () => {
    setProfile(null)
  }

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("broadcast", data => {
      console.log('received broadcast', data)
      getPosts()
      const post = JSON.parse(data)
      if (profile && post.authorId !== profile.authorId) {
        toast({
          title: "New Share",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{post.title}</code>
            </pre>
          ),
        })}
      }
    )

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className="hidden flex-col md:flex container">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-2">
            { !profile ?
              <><UserLogin onLoginSuccess={getProfile} /><UserRegister /></> :
              <div className="flex space-x-8"><SharePost onPostSuccess={getPosts} /><UserNav profile={profile} onLogoutSuccess={clearProfile} /></div>}
          </div>
        </div>
      </div>
      <div className="flex-col items-center justify-center">
      {
        posts && posts.map((post) => <Post post={post} profile={profile} key={`post-${post.id}`} />)
      }
      </div>
    </div>


  );
}