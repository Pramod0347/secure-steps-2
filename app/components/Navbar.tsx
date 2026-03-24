"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { BRAND_ASSETS } from "@/app/lib/constants";
import {
  Building,
  GraduationCap,
  Home,
  Link as LinkIcon,
  LogIn,
  LogOut,
  UserPlus,
  Users,
} from "lucide-react";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
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
    { path: "/select", label: "Select", icon: GraduationCap },
    { path: "/stay", label: "Stay", icon: Home },
    { path: "/connect", label: "Connect", icon: LinkIcon },
    { path: "/community", label: "Community", icon: Users },
    { path: "/lenders", label: "Lenders", icon: Building },
  ];

  return (
    <nav className="fixed top-4 left-1/2 z-[9999999] w-[94%] max-w-[720px] -translate-x-1/2 md:w-max md:min-w-[700px] md:max-w-[760px]">
      <div className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/70 px-3 py-2 shadow-[0_20px_44px_-22px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.98)] ring-1 ring-black/5 backdrop-blur-xl md:px-4 md:py-2.5">
        <span className="pointer-events-none absolute inset-x-2 top-1 h-[55%] rounded-t-[22px] bg-gradient-to-b from-white to-transparent" />
        <span className="pointer-events-none absolute -right-16 top-0 hidden h-28 w-44 rotate-12 bg-white/45 blur-2xl md:block" />
        <div className="relative z-10 hidden items-center justify-between gap-2.5 md:flex">
          <Link href="/" className="shrink-0 rounded-xl p-1 hover:bg-white/80 transition-colors">
            <Image
              src={BRAND_ASSETS.LOGO_URL}
              alt="Securesteps Logo"
              width={30}
              height={30}
              className="h-[30px] w-[30px]"
            />
          </Link>

          <div className="flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[16px] font-medium transition-all ${
                    active
                      ? "bg-white text-slate-950 shadow-sm ring-1 ring-fuchsia-200"
                      : "text-slate-800 hover:bg-white/95"
                  }`}
                >
                  {active && <Icon className="h-3.5 w-3.5 stroke-[2.2]" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href={`/profile/${isAuthenticated}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-800 hover:bg-white/95"
                  aria-label="Profile"
                >
                  <Users className="h-4 w-4 stroke-[2.2]" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-800 hover:bg-white/95"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4 stroke-[2.2]" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/quizform"
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                    pathname === "/quizform"
                      ? "bg-white text-slate-950 shadow-sm ring-1 ring-fuchsia-200"
                      : "text-slate-800 hover:bg-white/95"
                  }`}
                >
                  <UserPlus className="h-4 w-4 stroke-[2.2]" />
                  {pathname === "/quizform" && <span>Signup</span>}
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-800 hover:bg-white/95"
                  aria-label="Login"
                >
                  <LogIn className="h-4 w-4 stroke-[2.2]" />
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 md:hidden">
          <Link href="/" className="rounded-xl p-1 hover:bg-white/95 transition-colors">
            <Image
              src={BRAND_ASSETS.LOGO_URL}
              alt="Securesteps Logo"
              width={28}
              height={28}
              className="h-7 w-7"
            />
          </Link>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  active ? "bg-white text-slate-950 ring-1 ring-fuchsia-200" : "text-slate-800 hover:bg-white/95"
                }`}
                aria-label={item.label}
                title={item.label}
              >
                <Icon className="h-4 w-4 stroke-[2.2]" />
              </Link>
            );
          })}

          {isAuthenticated ? (
            <>
              <Link
                href={`/profile/${isAuthenticated}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-800 hover:bg-white/95"
                aria-label="Profile"
              >
                <Users className="h-4 w-4 stroke-[2.2]" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-800 hover:bg-white/95"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4 stroke-[2.2]" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/quizform"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  pathname === "/quizform" ? "bg-white text-slate-950 ring-1 ring-fuchsia-200" : "text-slate-800 hover:bg-white/95"
                }`}
                aria-label="Signup"
                title="Signup"
              >
                <UserPlus className="h-4 w-4 stroke-[2.2]" />
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-800 hover:bg-white/95"
                aria-label="Login"
                title="Login"
              >
                <LogIn className="h-4 w-4 stroke-[2.2]" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
