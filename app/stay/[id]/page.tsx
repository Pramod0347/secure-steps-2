/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Detail from '@/app/components/Stay/SpecificStay/Detail'
import Features from '@/app/components/Stay/SpecificStay/Features'
import Hero from '@/app/components/Stay/SpecificStay/Hero.Stay'
// import Landlord from '@/app/components/Stay/SpecificStay/LandLord'
// import Price from '@/app/components/Stay/SpecificStay/Price'
import Similar from '@/app/components/Stay/SpecificStay/Similar.Stay'
import { useRouter } from 'next/navigation'
import { Accommodation } from '@prisma/client'




const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) {
      router.push('/stay');
      return;
    }
    fetchAccommodationData();
  }, [params.id, router]);

  const fetchAccommodationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXTAUTH_URL || window.location.origin}/api/accommodations?id=${params.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error('No data received');
      }

      setAccommodation(data);
      toast.success('Successfully loaded accommodation details');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching accommodation data';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Redirect to /stay after showing error
      setTimeout(() => {
        router.push('/stay');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E50914]"></div>
      </div>
    );
  }

  // Error state
  if (error || !accommodation) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#E50914] mb-4">
            {error || 'Failed to load accommodation details'}
          </h1>
          <p className="text-gray-600">Redirecting to listings page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Hero accommodation={accommodation} />
      <Detail accommodation={accommodation} />
      <Features amenities={accommodation.amenities} />
      {/* <Price pricingPlans={accommodation.pricingPlans} />
      <Landlord landlord={accommodation.landlord} /> */}
      <Similar />
    </div>
  );
}

export default Page;