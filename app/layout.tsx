'use client'

import { useEffect } from "react";
// import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Home/Footer";
import { AuthProvider } from "@/app/context/AuthContext";
import AuthWrapper from "@/app/context/AuthWrapper";
// import { SessionProvider } from 'next-auth/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner";
import { GOOGLE_ADS_ID } from "@/app/lib/analytics/googleAds";
import { BRAND_ASSETS } from "@/app/lib/constants";

// Local Inter font to avoid runtime dependency on Google Fonts
const inter = localFont({
  src: [
    {
      path: "./assets/Inter.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

// this is comment//
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
  useEffect(() => {
    // 1. Prevent zoom on wheel/trackpad (Ctrl + scroll / Cmd + scroll)
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // 2. Prevent mobile pinch-to-zoom (multi-touch gesture)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // 3. Prevent keyboard shortcuts for zooming (Ctrl/Cmd + Plus, Minus, Zero)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '-' || e.key === '+' || e.key === '0')) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href={BRAND_ASSETS.LOGO_URL} type="image/png" />
        <link rel="apple-touch-icon" href={BRAND_ASSETS.LOGO_URL} />
        {/* Add global head tags like meta tags, styles, and Google script */}
        <script
          async
          src="https://accounts.google.com/gsi/client"
        ></script>
      </head>
      <body className={`antialiased min-h-screen flex flex-col overflow-x-hidden ${inter.className}`}>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ADS_ID}');
            `}
          </Script>

          <AuthProvider>
            <AuthWrapper>
              <Navbar />
              <main className="flex-grow w-full">
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
