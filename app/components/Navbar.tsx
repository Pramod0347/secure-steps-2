"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import logo from "../assets/logo.png";
import MenuIcon from "@/app/assets/menu-icon.svg";
import { UserPlus, UserRound, X } from "lucide-react";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (pathname.startsWith("/admin/")) {
    return null;
  }

  const navItems = [
    { path: "/select", label: "Select" },
    { path: "/stay", label: "Stay" },
    { path: "/connect", label: "Connect" },
    { path: "/community", label: "Community" },
    { path: "/lenders", label: "Lenders" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[85%] md:w-auto !z-[9999999] rounded-xl bg-[#00000094]/20 bg-opacity-70 md:px-[29px] px-4 py-[15px] text-white shadow-lg backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between gap-6 space-x-2 text-[16px] font-medium ">
        <div className="inter w-full flex items-center md:justify-center justify-between gap-4 overflow-hidden">
          <Link href="/">
            <Image src={logo} alt="Logo" className="h-[29px] w-[127px] " />
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${
                isActive(item.path) ? "text-[#E50914]" : "text-white"
              } hover:text-[#E50914] hidden md:block  md:text-[14px] 2xl:text-[16px]`}
            >
              {item.label}
            </Link>
          ))}

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative w-8 h-8 flex items-center justify-center"
            >
              <div
                className={`transition-opacity duration-300 absolute ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              >
                <Image
                  src={MenuIcon}
                  alt="Menu"
                  className="cursor-pointer w-8"
                />
              </div>
              <div
                className={`transition-opacity duration-300 absolute ${
                  mobileMenuOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                <X className="w-8 h-8" />
              </div>
            </button>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="hidden md:block">
            <Avatar />
          </div>
        ) : (
          <>
            {/* Signup Button */}
            <Link href="/quizform" className="hidden md:block">
              <button className="bt-c inter w-28 rounded-xl px-1 py-1 md:text-[14px] 2xl:text-[16px]">
                Signup
              </button>
            </Link>

            {/* Login Button with Icon */}
            <Link href="/auth/signin" className="hidden md:flex items-center">
              <button
                className="
      flex items-center gap-2
      px-4 py-2
      rounded-full
      text-white
      font-medium
      md:text-[14px] 2xl:text-[16px]
      transition-all duration-300

      bg-gradient-to-r 
      from-[#C51B26]   /* red from your image */
      to-[#3F2B96]     /* purple from your image */
      hover:opacity-90
    "
              >
                <UserPlus className="w-5 h-5 text-white" />
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed left-0 right-0 top-[4.5rem] transition-all duration-300 ease-in-out transform ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="bg-black/95 backdrop-blur-lg rounded-xl p-4 mx-4 shadow-lg border border-gray-800">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`${
                  isActive(item.path) ? "text-[#E50914]" : "text-white"
                } hover:text-[#E50914] block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  href={`/profile/${isAuthenticated}`}
                  className="text-white block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-white block py-2 px-4 w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/quizform"
                  className="block text-center text-white py-2 px-4 rounded-lg bg-[#E50914] hover:bg-[#E50914]/80 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Signup
                </Link>
                <Link
                  href="/auth/signin"
                  className="block text-center text-white py-2 px-4 rounded-lg bg-[#E50914] hover:bg-[#E50914]/80 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
