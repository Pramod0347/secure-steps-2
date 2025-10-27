'use client'

// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Home/Footer";
import { AuthProvider } from "@/app/context/AuthContext";
import AuthWrapper from "@/app/context/AuthWrapper";
// import { SessionProvider } from 'next-auth/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner";


// Font configurations
const geistSans = localFont({
  src: [
    {
      path: './fonts/GeistVF.woff',
      weight: '100 900',
      style: 'normal',
    }
  ],
  variable: '--font-geist-sans',
  display: 'swap',
  fallback: ['system-ui', 'arial']
});

const geistMono = localFont({
  src: [
    {
      path: './fonts/GeistMonoVF.woff',
      weight: '100 900',
      style: 'normal',
    }
  ],
  variable: '--font-geist-mono',
  display: 'swap',
  fallback: ['monospace']
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Add global head tags like meta tags, styles, and Google script */}
        <script
          async
          src="https://accounts.google.com/gsi/client"
        ></script>
      </head>
      <body className="antialiased min-h-screen flex flex-col overflow-x-hidden">

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
        {/* <SessionProvider>
        </SessionProvider> */}
      </body>
    </html>
  );
}