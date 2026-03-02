'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from "framer-motion";

import Hero from "@/app/components/Connect/UserProfile/Hero";
import About from "@/app/components/Connect/UserProfile/About";
import ActivityCards from "@/app/components/Connect/UserProfile/ActivityCards";
import EditProfileModal from '../components/profile/EditProfile';
import { useAuth } from '@/app/context/AuthContext';

// Ensure the User interface is comprehensive
interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  header: string;
  bio: string | null;
  avatar: string | null;
  avatarUrl: string | null;
  banner: string | null;
  role: string;
  followersCount: number;
  followingCount: number;
  department: string | null;
  program: string | null;
  graduationYear: string | null;
  phoneNumber: string | null;
}


const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Fetch user data when component mounts or auth user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser?.id) {
        router.push('/auth/signin');
        return;
      }

      try {
        const response = await fetch(`/api/auth/user?id=${authUser.id}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setEditedUser(data.user);
        } else {
          toast.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('An error occurred while fetching user data');
      }
    };

    fetchUserData();
  }, [authUser?.id, router]);

  // Handle input changes during editing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Handle profile update
  const handleSave = async () => {
    if (!editedUser) return;

    setIsSaving(true);
    const loadingToast = toast.loading('Saving changes...');

    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL || window.location.origin}/api/auth/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUser(updatedData.user);
        setEditedUser(updatedData.user);
        toast.dismiss(loadingToast);
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setIsModalOpen(false);
      } else {
        toast.dismiss(loadingToast);
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.dismiss(loadingToast);
      toast.error('An error occurred while updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-screen flex flex-col items-center justify-center relative">
      {/* <motion.div
        whileTap={{ scale: 0.8 }}
        className='absolute z-[9999] p-2 bg-red-500 text-white right-8 top-5 rounded-lg cursor-pointer'
        onClick={() => setIsModalOpen(true)}
      >
        Edit Profile
      </motion.div> */}
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
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => !isSaving && setIsModalOpen(false)}
        user={user}
        onSave={handleSave}
     
      />
    </div>
  );
};

export default ProfilePage;