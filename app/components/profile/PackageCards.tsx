'use client'

import React from 'react'
import { Button } from '@/app/components/ui/Button'

export default function PackageCards() {
  return (
    <section className="py-12 px-8 bg-white dark:bg-black">
      <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Invest in your future
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-base">
        Your seamless study abroad experience starts here
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <PackageCard 
          destination="UK Universities"
          description="Apply to 3 universities & 4 years"
          price="29,999"
          currency="₹"
          features={[
            "Application to 3 universities",
            "Essay review & editing",
            "Unlimited counselling sessions",
            "Interview preparation",
            "Pre-departure briefing",
            "Visa assistance"
          ]}
        />
        
        <PackageCard 
          destination="USA/ Dubai/ Australia/ Canada"
          description="Apply to 3 universities & 4 years"
          price="69,999"
          currency="₹"
          features={[
            "Application to 8 universities",
            "Essay review & editing",
            "Unlimited counselling sessions",
            "Interview preparation",
            "Pre-departure briefing",
            "Visa assistance"
          ]}
        />
      </div>
    </section>
  )
}

function PackageCard({ 
  destination, 
  description, 
  price, 
  currency,
  features 
}: { 
  destination: string
  description: string
  price: string
  currency: string
  features: string[]
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{destination}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-xs mb-4">{description}</p>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
            <span className="text-green-500">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{currency} {price}</span>
          <span className="text-xs text-gray-500">per individual</span>
        </div>
      </div>

      <Button 
        className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold py-2 rounded-lg transition-colors text-sm"
      >
        Purchase
      </Button>
    </div>
  )
}
