'use client'

import React from 'react'

export default function ClientBenefits() {
  return (
    <section className="py-12 px-8 bg-white dark:bg-black">
      <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Secure client benefits
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-base">
        Your seamless study abroad experience starts here
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BenefitCard 
          icon="🛡️"
          title="100% Transparency"
          description="Real-time updates on every step"
        />
        <BenefitCard 
          icon="👥"
          title="Expert Team"
          description="Dedicated counselors & visa consultants"
        />
        <BenefitCard 
          icon="🌍"
          title="Global Network"
          description="Partnership with 500+ universities"
        />
        
        <BenefitCard 
          icon="⏰"
          title="24/7 Support"
          description="Always here to help you"
        />
        <BenefitCard 
          icon="⭐"
          title="95% Success Rate"
          description="Proven track record of admissions"
        />
        <BenefitCard 
          icon="🎓"
          title="Scholarship"
          description="Assistance worth $200+ secured"
        />
      </div>
    </section>
  )
}

function BenefitCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6 hover:shadow-lg transition-all">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}
