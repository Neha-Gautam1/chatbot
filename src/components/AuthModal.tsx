"use client"
import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { MapPin, Check } from "lucide-react"

interface AuthModalProps {
  children: React.ReactNode
  defaultTab?: "signin" | "signup"
}

const AuthModal = ({ children, defaultTab = "signin" }: AuthModalProps) => {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(defaultTab)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const router = useRouter()

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.")
      return
    }
    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        toast.success("Location captured!")
        setIsGettingLocation(false)
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("You denied the request for Geolocation.")
            break
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable.")
            break
          case error.TIMEOUT:
            toast.error("The request to get user location timed out.")
            break
          default:
            toast.error("An unknown error occurred while getting location.")
            break
        }
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    )
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      if (res?.error) {
        toast.error("Invalid credentials")
      } else {
        toast.success("Login successful")
        setOpen(false)
        router.refresh()
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!")
      return
    }
    try {
      const userData = {
        name,
        email,
        password,
        location: location
          ? {
              type: "Point",
              coordinates: [location.longitude, location.latitude],
            }
          : undefined,
      }
      const res = await axios.post("/api/signup", userData)
      if (res.status === 201) {
        toast.success("User created successfully. Please sign in.")
        setPassword("")
        setConfirmPassword("")
        setName("")
        setActiveTab("signin")
      }
    } catch (error) {
      toast.error("Error creating user")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to MediCare AI</DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Get Started</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center"
                  onClick={handleGetLocation}
                  disabled={isGettingLocation || !!location}
                >
                  {isGettingLocation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                      Getting Location...
                    </>
                  ) : location ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Location Captured
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Location for Nearby Care
                    </>
                  )}
                </Button>
              </div>
              <Button type="submit" className="w-full">
                Get Started
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
