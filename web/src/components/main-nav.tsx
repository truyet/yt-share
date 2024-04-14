import Link from "next/link"

import { cn } from "@/lib/utils"
import { Home } from "lucide-react"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Home />
      <Link
        href="/"
        className="text-lg font-medium transition-colors hover:text-primary"
      >
        Funny Movies
      </Link>
    </nav>
  )
}