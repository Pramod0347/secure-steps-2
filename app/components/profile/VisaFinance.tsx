'use client'

import React, { useState, useMemo } from 'react'
import { Calculator, Globe } from 'lucide-react'

type Country = 'usa' | 'uk' | 'canada'

interface VisaRequirement {
  icon: string
  label: string
  highlight?: boolean
}

interface CountryData {
  name: string
  flag: string
  visaFee: string
  requirements: VisaRequirement[]
}

const countryData: Record<Country, CountryData> = {
  usa: {
    name: 'United States',
    flag: '🇺🇸',
    visaFee: '$160',
    requirements: [
      { icon: '📋', label: 'F-1 Student Visa Application' },
      { icon: '💳', label: 'SEVIS Fee Payment ($350)' },
      { icon: '📄', label: 'Financial Documentation' },
      { icon: '📝', label: 'I-20 Form from University' },
      { icon: '🗓️', label: 'Visa Interview Appointment' },
      { icon: '🎓', label: 'English Proficiency Proof' },
    ],
  },
  uk: {
    name: 'United Kingdom',
    flag: '🇬🇧',
    visaFee: '£363',
    requirements: [
      { icon: '📋', label: 'Student Visa Application' },
      { icon: '💳', label: 'Immigration Health Surcharge' },
      { icon: '📄', label: 'Financial Documentation' },
      { icon: '📝', label: 'CAS from University' },
      { icon: '🗓️', label: 'Biometric Appointment' },
      { icon: '🎓', label: 'English Proficiency (IELTS/TOEFL)' },
    ],
  },
  canada: {
    name: 'Canada',
    flag: '🇨🇦',
    visaFee: 'CAD $150',
    requirements: [
      { icon: '📋', label: 'Study Permit Application' },
      { icon: '💳', label: 'Biometrics Fee (CAD $85)' },
      { icon: '📄', label: 'Proof of Funds' },
      { icon: '📝', label: 'Letter of Acceptance' },
      { icon: '🗓️', label: 'Medical Examination' },
      { icon: '🎓', label: 'English/French Proficiency' },
    ],
  },
}

export default function VisaFinance() {
  const [selectedCountry, setSelectedCountry] = useState<Country>('usa')
  
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(73706)
  const [interestRate, setInterestRate] = useState(8)
  const [loanTenure, setLoanTenure] = useState(10)

  // Calculate EMI
  const monthlyEMI = useMemo(() => {
    const principal = loanAmount
    const rate = interestRate / 100 / 12
    const months = loanTenure * 12
    
    if (rate === 0) return Math.round(principal / months)
    
    const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
    return Math.round(emi)
  }, [loanAmount, interestRate, loanTenure])

  // Cost Estimator Data
  const costItems = [
    { label: 'Tuition Fees', amount: '$45,000/year' },
    { label: 'Living Expenses', amount: '$20,000/year' },
    { label: 'Books & Supplies', amount: '$2,000/year' },
    { label: 'Health Insurance', amount: '$3,000/year' },
  ]

  const totalCost = 70000

  const countries: { value: Country; name: string; flag: string }[] = [
    { value: 'usa', name: 'United States', flag: '🇺🇸' },
    { value: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { value: 'canada', name: 'Canada', flag: '🇨🇦' },
  ]

  const currentCountry = countryData[selectedCountry]

  return (
    <section className="p-8 bg-white dark:bg-black min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Visa & Financial Planning
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Navigate visa requirements and plan your finances
        </p>
      </div>

      {/* Country Selection */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 justify-center">
          {countries.map((country) => (
            <button
              key={country.value}
              onClick={() => setSelectedCountry(country.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all min-w-[120px] ${
                selectedCountry === country.value
                  ? 'bg-white dark:bg-gray-800 shadow-md ring-2 ring-black dark:ring-white'
                  : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <span className="text-5xl">{country.flag}</span>
              <span className={`text-sm font-medium ${
                selectedCountry === country.value 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {country.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Visa Requirements */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Visa Requirements - {currentCountry.name}
          </h2>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Visa Application Fee: <span className="font-semibold text-gray-900 dark:text-white">{currentCountry.visaFee}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCountry.requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-sm">{req.icon}</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{req.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Planning Tools Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Financial Planning Tools
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Calculate your expenses
        </p>
      </div>

      {/* Financial Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EMI Calculator */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h3 className="font-bold text-gray-900 dark:text-white">EMI Calculator</h3>
          </div>

          {/* Loan Amount Slider */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Loan Amount ($)
            </label>
            <input
              type="range"
              min="10000"
              max="200000"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
            />
            <p className="text-green-500 font-semibold mt-2">
              ${loanAmount.toLocaleString()}
            </p>
          </div>

          {/* Interest Rate Slider */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Interest Rate (%)
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
            />
            <p className="text-green-500 font-semibold mt-2">
              {interestRate}%
            </p>
          </div>

          {/* Loan Tenure Slider */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Loan Tenure (Years)
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
            />
            <p className="text-green-500 font-semibold mt-2">
              {loanTenure} years
            </p>
          </div>

          {/* EMI Result */}
          <div className="bg-black dark:bg-white text-white dark:text-black rounded-xl py-3 px-4 text-center">
            <span className="font-medium">Monthly EMI : </span>
            <span className="font-bold">${monthlyEMI.toLocaleString()}</span>
          </div>
        </div>

        {/* Cost Estimator */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h3 className="font-bold text-gray-900 dark:text-white">Cost Estimator</h3>
          </div>

          <div className="space-y-4">
            {costItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.amount}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Annual cost</span>
              <span className="text-2xl font-bold text-green-500">${totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
