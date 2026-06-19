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
    ...(user?.role === 'ADMIN'
      ? [{ icon: '🛠️', label: 'Content Manager', section: 'content' }]
      : []),
    { icon: '📊', label: 'Application Tracking', section: 'applications' },
    { icon: '💳', label: 'Visa & Finance', section: 'visa' },
    { icon: '📚', label: 'E-Books', section: 'ebooks' },
    { icon: '🔥', label: 'FIRE Mode', section: 'fire' },
  ]

  return (
    <aside className="w-full rounded-2xl bg-black p-4 text-white shadow-[0_16px_40px_-24px_rgba(0,0,0,0.7)] md:sticky md:top-4 md:h-[70vh] md:w-64 md:overflow-y-auto md:scrollbar-hide md:p-6">
      <div className="mb-4 flex items-center gap-3 md:mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-sm truncate">{user?.name || 'User'}</h3>
          <p className="text-xs text-gray-400 truncate">{user?.email || 'email@gmail.com'}</p>
        </div>
      </div>

      <div className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500 md:mb-4 md:px-2">Menu</div>

      <nav className="scrollbar-hide flex gap-2 overflow-x-auto pb-1 md:block md:space-y-2 md:overflow-visible md:pb-0">
        {menuItems.map((item) => (
          <Link
            key={item.section}
            href={`/profile?section=${item.section}`}
            className="shrink-0 md:block"
          >
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all md:gap-3 ${
                activeSection === item.section
                  ? 'bg-white font-semibold text-black'
                  : 'text-gray-300 hover:bg-gray-900'
              }`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <span className="whitespace-nowrap md:truncate">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
