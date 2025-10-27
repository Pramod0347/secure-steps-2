"use client"

import { X } from "lucide-react"

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  onClose?: (tabId: string) => void
}

export function Tabs({ tabs, activeTab, onChange, onClose }: TabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative">
            <button
              onClick={() => onChange(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? "border-[#DA202E] text-[#DA202E]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              {tab.label}
            </button>
            {tab.id === "edit" && onClose && (
              <button
                onClick={() => onClose(tab.id)}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}

