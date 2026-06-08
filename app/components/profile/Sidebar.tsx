'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { useSearchParams } from 'next/navigation'

export default function Sidebar() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const activeSection = searchParams.get('section') || 'onboarding'

  const menuItems = [
    { icon: '🚀', label: 'Journey roadmap', section: 'journey' },
    { icon: '🔐', label: 'Onboarding', section: 'onboarding' },
    { icon: '🎓', label: 'Universities', section: 'universities' },
    { icon: '📄', label: 'Documents', section: 'documents' },
    { icon: '🎯', label: 'Portfolio', section: 'portfolio' },
    { icon: '📊', label: 'Application Tracking', section: 'applications' },
    { icon: '💳', label: 'Visa & Finance', section: 'visa' },
    { icon: '📚', label: 'E-Books', section: 'ebooks' },
    { icon: '🔥', label: 'FIRE Mode', section: 'fire' },
  ]

  return (
    <aside className="bg-black text-white p-6 sticky top-0 overflow-y-auto w-64 flex flex-col rounded-2xl scrollbar-hide h-[70%]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-sm truncate">{user?.name || 'User'}</h3>
          <p className="text-xs text-gray-400 truncate">{user?.email || 'email@gmail.com'}</p>
        </div>
      </div>

      <div className="text-xs text-gray-500 uppercase tracking-wider mb-4 px-2 font-semibold">Menu</div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.section}
            href={`/profile?section=${item.section}`}
          >
            <div
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm ${
                activeSection === item.section
                  ? 'bg-white text-black font-semibold'
                  : 'text-gray-300 hover:bg-gray-900'
              }`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
