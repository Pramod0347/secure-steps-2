//connect/[id]/page.tsx
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Hero from "@/app/components/Connect/UserProfile/Hero"
import About from "@/app/components/Connect/UserProfile/About"
import ActivityCards from "@/app/components/Connect/UserProfile/ActivityCards"
import TopArticles from "@/app/components/Connect/UserProfile/TopArticles"
// import { useAuth } from '@/app/context/AuthContext'

interface ProfileUser {
  id: string
  username: string
  email: string
  name: string
  banner: string | null
  header: string | null
  bio: string | null
  avatarUrl: string | null
  role: string
  followersCount: number
  followingCount: number
  department: string | null
  program: string | null
  graduationYear: string | null
  
}

interface PageProps {
  params: {
    id: string
  }
}

const Page: React.FC<PageProps> = ({ params }) => {
  // const { setUser } = useAuth()
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<ProfileUser | null>(null)
  const router = useRouter()

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`/api/auth/user?id=${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const data = await response.json()
      setProfileUser(data.user)
      setEditedUser(data.user)
    } catch (error) {
      console.error(error)
      toast.error('An error occurred while fetching user data')
    }
  }, [params.id])

  useEffect(() => {
    if (!params.id) {
      router.push('/connect')
      return
    }
    
    void fetchUserData()
  }, [params.id, router, fetchUserData])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editedUser) return

    try {
      const response = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setProfileUser(editedUser)
      // setUser(editedUser)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('An error occurred while updating profile')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedUser(prev => prev ? { ...prev, [name]: value } : null)
  }

  if (!profileUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Hero
        user={profileUser}
        isEditing={isEditing}
        editedUser={editedUser}
        handleChange={handleChange}
        handleEdit={handleEdit}
        handleSave={handleSave}
      />
      <hr className="w-full my-20 border-4 md:border-8" />
      <About
        user={profileUser}
        isEditing={isEditing}
        editedUser={editedUser}
        handleChange={handleChange}
      />
      <hr className="w-full my-20 border-4 md:border-8" />
      <ActivityCards />
      <TopArticles />
    </div>
  )
}

export default Page