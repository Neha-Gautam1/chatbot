"use client"

import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ThemeToggle } from "./ThemeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import AuthModal from "./AuthModal"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"

export function HeaderClient() {
  const { data: session } = useSession()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse" />
        <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <ThemeToggle />
      {session ? (
        <div className="flex items-center space-x-4">
          <span className="font-medium text-foreground">
            {session.user?.name}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={session.user?.image ?? undefined}
                    alt={session.user?.name ?? "User Avatar"}
                  />
                  <AvatarFallback>
                    {session.user?.name?.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <>
          <AuthModal defaultTab="signin">
            <Button variant="outline">Sign In</Button>
          </AuthModal>
          <AuthModal defaultTab="signup">
            <Button>Get Started</Button>
          </AuthModal>
        </>
      )}
    </div>
  )
} 