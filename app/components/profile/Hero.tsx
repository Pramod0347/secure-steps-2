'use client'

import React from 'react'

export default function Hero() {
  return (
    <section className="py-12 px-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
          Welcome to Secure !
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          Your seamless study abroad experience starts here
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          A Seamless Experience Awaits
        </h2>
        
        <p className="text-gray-700 dark:text-gray-300 text-base mb-8 leading-relaxed">
          At Secure, we've reimagined the study abroad journey. From your first consultation to sending of your dream university, every step is designed to be smooth, transparent, and stress-free.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureBox 
            icon="👤"
            title="Personalized Consultation"
            description="1-on-1 sessions with expert counselors"
          />
          <FeatureBox 
            icon="🎯"
            title="Smart University Matching"
            description="AI-powered recommendations based on your profile"
          />
          <FeatureBox 
            icon="✨"
            title="Application Excellence"
            description="Expert guidance on essays, documents, and interviews"
          />
          <FeatureBox 
            icon="🛂"
            title="Visa & Pre-departure"
            description="Complete support until you reach your destination"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureBox({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="text-3xl flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  )
}
