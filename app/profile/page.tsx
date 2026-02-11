'use client'

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Sidebar from '@/app/components/profile/Sidebar';
import Hero from '@/app/components/profile/Hero';
import Features from '@/app/components/profile/Features';
import ClientBenefits from '@/app/components/profile/ClientBenefits';
import PackageCards from '@/app/components/profile/PackageCards';
import Universities from '@/app/components/profile/Universities';

function ProfileContent() {
  const searchParams = useSearchParams()
  const section = searchParams.get('section') || 'onboarding'

  const renderSection = () => {
    switch (section) {
      case 'onboarding':
        return (
          <>
            <Hero />
            <Features />
            <ClientBenefits />
            <PackageCards />
          </>
        )
      case 'universities':
        return <Universities />
      case 'journey':
        return <div className="p-8 text-center text-gray-500">Journey roadmap - Coming soon</div>
      case 'documents':
        return <div className="p-8 text-center text-gray-500">Documents - Coming soon</div>
      case 'portfolio':
        return <div className="p-8 text-center text-gray-500">Portfolio - Coming soon</div>
      case 'applications':
        return <div className="p-8 text-center text-gray-500">Application Tracking - Coming soon</div>
      case 'visa':
        return <div className="p-8 text-center text-gray-500">Visa & Finance - Coming soon</div>
      case 'ebooks':
        return <div className="p-8 text-center text-gray-500">E-Books - Coming soon</div>
      case 'fire':
        return <div className="p-8 text-center text-gray-500">FIRE Mode - Coming soon</div>
      default:
        return (
          <>
            <Hero />
            <Features />
            <ClientBenefits />
            <PackageCards />
          </>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-black m-32">
      {/* Sidebar - Fixed on left */}
      <Sidebar />
      
      {/* Main Content - Scrollable on right */}
      <main className="flex-1 overflow-y-auto">
        {renderSection()}
      </main>
    </div>
  )
}

const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authUser?.id) {
      router.push('/auth/signin');
      return;
    }
  }, [authUser?.id, router]);

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
};

export default ProfilePage;