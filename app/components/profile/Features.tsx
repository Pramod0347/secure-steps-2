'use client'

import React from 'react'

export default function Features() {
  return (
    <section className="py-12 px-8 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Why Choose Secure Steps?
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-base">
        Everything you need for a successful study abroad journey
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureItem 
          number="1"
          title="Personalized Profile Building"
          description="Create a comprehensive profile with all your academic achievements, test scores, and extracurricular activities"
        />
        <FeatureItem 
          number="2"
          title="Smart Document Management"
          description="Upload, organize, and manage all your application documents in one secure place"
        />
        <FeatureItem 
          number="3"
          title="University Shortlisting"
          description="Get AI-powered recommendations matching your profile with perfect universities"
        />
        <FeatureItem 
          number="4"
          title="Application Tracking"
          description="Monitor real-time status of all your applications in a single dashboard"
        />
        <FeatureItem 
          number="5"
          title="Expert Counseling"
          description="Get 1-on-1 guidance from seasoned education counselors and visa experts"
        />
        <FeatureItem 
          number="6"
          title="Resource Library"
          description="Access comprehensive e-books, guides, and resources for exam prep and interviews"
        />
      </div>
    </section>
  )
}

function FeatureItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold text-sm">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  )
}
