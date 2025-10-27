'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from "../context/AuthContext"

const Avatar = () => {
  const { user, logout } = useAuth()
  const [showPopup, setShowPopup] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/auth/signin')
  }

  return (
    <div className="relative">
      <div 
        className="rounded-full overflow-hidden cursor-pointer"
        onMouseEnter={() => setShowPopup(true)}
        onClick={() => setShowPopup(!showPopup)} // For mobile
      >
        <Image 
          src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
          alt="Profile Picture" 
          width={40}
          height={40}
          className="object-cover rounded-full"
        />
      </div>
      {showPopup && (
        <div 
          ref={popupRef}
          className="absolute -left-16 mt-5 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fade-in-down"
        >
          <Link href={`/profile`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Profile
          </Link>
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default Avatar

