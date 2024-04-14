import { SharePost } from "./share-post";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

type UserNavProps = {
  onLogoutSuccess: () => {},
  profile: any
}

export function UserNav({ profile, onLogoutSuccess }: UserNavProps) {

  const logout = async () => {
    await fetch('/api/auth/logout')
    onLogoutSuccess()
  }

  return (
    <div className="flex space-x-1 items-center">
      <Label> {profile.email}</Label>
      <Button variant="link" onClick={logout}>Logout</Button>
    </div>
  )
}