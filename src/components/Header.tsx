"use client"
import { Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import { HeaderClient } from "./HeaderClient"
import React from "react"

const Header = () => {
  const navigate = useRouter()
  return (
    <header className="bg-background shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate.push("/")}>
            <Activity className="w-8 h-8 text-blue-600 mr-3" />
            <span className="text-2xl font-bold text-foreground">
              MediCare AI
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => navigate.push("/")}
              className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => navigate.push("/find-care")}
              className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
            >
              Find Care
            </button>
            <button
              onClick={() => navigate.push("/doctor-directory")}
              className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
            >
              Doctors
            </button>
            <button
              onClick={() => navigate.push("/medical-records")}
              className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
            >
              Records
            </button>
            <button
              onClick={() => navigate.push("/medical-schemes")}
              className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
            >
              Schemes
            </button>
            <button
              onClick={() => navigate.push("/join-us")}
              className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
            >
              Join Us
            </button>
          </nav>
          <HeaderClient />
        </div>
      </div>
    </header>
  )
}
export default Header
