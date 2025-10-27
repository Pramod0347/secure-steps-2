/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Hero from "@/app/components/Connect/UserProfile/Hero"
import About from "@/app/components/Connect/UserProfile/About"
import ActivityCards from "@/app/components/Connect/UserProfile/ActivityCards"
import TopArticles from "@/app/components/Connect/UserProfile/TopArticles"
import { useAuth } from "@/app/context/AuthContext"
// import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Home/Footer"

interface User {
  id: string
  username: string
  email: string
  name: string
  bio: string | null
  avatarUrl: string | null
  role: string
  followersCount: number
  followingCount: number
  department: string | null
  program: string | null
  graduationYear: string | null
  banner: string | null
  header: string | null
  about?: string
}

export default function ProfileContent() {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!authUser?.id) {
      router.push("/connect")
      return
    }
    fetchUserData()
  }, [authUser?.id, router])

  const fetchUserData = async () => {
    if (!authUser?.id) return
    
    try {
      const response = await fetch(`/api/auth/user?id=${authUser.id}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setEditedUser(data.user)
      } else {
        toast.error("Failed to fetch user data")
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error("An error occurred while fetching user data")
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/auth/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      })

      if (response.ok) {
        setUser(editedUser)
        setIsEditing(false)
        toast.success("Profile updated successfully")
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("An error occurred while updating profile")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedUser(prev => prev ? { ...prev, [name]: value } : null)
  }

  if (!user) return null

  return (
    <div className="w-full flex flex-col items-center justify-center">

      <Hero
        user={user}
        isEditing={isEditing}
        editedUser={editedUser}
        handleChange={handleChange}
        handleEdit={handleEdit}
        handleSave={handleSave}
      />
      <hr className="w-full my-20 border-4 md:border-8" />
      <About
        user={user}
        isEditing={isEditing}
        editedUser={editedUser}
        handleChange={handleChange}
      />
      <hr className="w-full my-20 border-4 md:border-8" />
      <ActivityCards />
      <TopArticles  />
      <Footer />
    </div>
  )
}
