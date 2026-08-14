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
import Documents from '@/app/components/profile/Documents';
import Portfolio from '@/app/components/profile/Portfolio';
import ContentManager from '@/app/components/profile/ContentManager';
import VisaFinance from '@/app/components/profile/VisaFinance';

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
      case 'documents':
        return <Documents />
      case 'journey':
      case 'portfolio':
        return <Portfolio />
      case 'content':
        return <ContentManager />
      case 'applications':
        return <div className="p-8 text-center text-gray-500">Application Tracking - Coming soon</div>
      case 'visa':
        return <VisaFinance />
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
    <div className="mx-0 mt-24 flex min-h-screen flex-col gap-4 bg-gradient-to-b from-white to-gray-50 px-3 py-3 dark:from-black dark:to-gray-950 sm:px-4 lg:mx-16 lg:my-12 lg:flex-row lg:gap-6 lg:px-0">
      {/* Sidebar - Fixed on left */}
      <Sidebar />
      
      {/* Main Content - Scrollable on right */}
      <main className="w-full flex-1 overflow-visible lg:overflow-y-auto lg:scrollbar-hide">
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