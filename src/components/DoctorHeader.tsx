"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  Activity,
  Users,
  DollarSign,
  User,
  Mountain,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "./ThemeToggle"

const navLinks = [
  { href: "/doctor", label: "Dashboard", icon: Mountain },
  { href: "/doctor/activity", label: "Activity", icon: Activity },
  { href: "/doctor/patients", label: "Patients", icon: Users },
  { href: "/doctor/earnings", label: "Earnings", icon: DollarSign },
]

const DoctorHeader = () => {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = () => {
    // In a real app, you'd clear the user's session here
    router.push("/")
  }

  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          pathname === link.href
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-50"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
          isMobile && "text-base w-full"
        )}
      >
        <link.icon className="h-4 w-4" />
        {link.label}
      </Link>
    ))

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-slate-950">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              MediCare AI
            </span>
          </Link>
          <div className="hidden md:block border-l border-slate-200 dark:border-slate-700 h-6"></div>
          <span className="hidden md:block text-sm font-bold text-slate-500 dark:text-slate-400">
            Doctor Portal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-2 md:flex">
            {renderNavLinks()}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === "/doctor/profile"
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-50"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                  )}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/doctor/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 p-4">
                {renderNavLinks(true)}
                <Link
                  href="/doctor/profile"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="flex justify-start items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default DoctorHeader
