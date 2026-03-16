"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Clock, Users, Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import Typewriter from "./Typewriter"

const Hero = () => {
  const navigate = useRouter()
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              AI-Powered
              <span className="text-blue-600 block">Medical Care</span>
              at Your Fingertips
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Get instant medical insights with speech recognition, find nearby
              healthcare providers, and manage your medical records with our
              advanced AI-powered platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 animate-diagnosis-glow transition-transform duration-300 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                onClick={() => navigate.push("/speech-analysis")}
              >
                <span className="inline-block animate-fade-in-up">
                  Start Your AI Diagnosis
                </span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate.push("/find-care")}
              >
                Find Care Nearby
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">
                  DISHA Compliant
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-muted-foreground">
                  24/7 Available
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium text-muted-foreground">
                  Expert Network
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Your Health Assistant
                </h3>
                <p className="text-muted-foreground">
                  <Typewriter
                    words={[
                      "Always ready to help with your medical needs",
                      "Keep track of your medical records",
                      "Virtual Consultation at minimum rates"
                    ]}
                    typingSpeed={60}
                    deletingSpeed={30}
                    pause={1200}
                    className="text-blue-700 font-medium text-lg"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
