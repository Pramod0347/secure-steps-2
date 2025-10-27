import React, { useState } from 'react'

interface RulesListProps {
  rules: string[]
  onChange: (rules: string[]) => void
}

export function RulesList({ rules, onChange }: RulesListProps) {
  const [newRule, setNewRule] = useState('')

  const addRule = () => {
    if (newRule.trim()) {
      onChange([...rules, newRule.trim()])
      setNewRule('')
    }
  }

  const removeRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Rules</label>
      
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          placeholder="Add rule"
          onKeyPress={(e) => e.key === 'Enter' && addRule()}
        />
        <button
          type="button"
          onClick={addRule}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
          >
            <span>{rule}</span>
            <button
              type="button"
              onClick={() => removeRule(index)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

