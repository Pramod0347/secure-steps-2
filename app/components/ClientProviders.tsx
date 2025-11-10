'use client'

import type React from "react"
import { AuthProvider } from "@/app/context/AuthContext"
import AuthWrapper from "@/app/context/AuthWrapper"
import Navbar from "./Navbar"
import Footer from "./Home/Footer"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthWrapper>
        <Navbar />
        <main className="flex-grow ">
          <Toaster/>
          {children}
          <SpeedInsights />
        </main>
        <Footer />
      </AuthWrapper>
    </AuthProvider>
  )
}

