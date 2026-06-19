'use client'

import React, { useMemo, useState } from 'react'
import { Calculator, FileCheck2, Globe, ListChecks } from 'lucide-react'
import {
  Country,
  EuropeCountry,
  countrySelector,
  europeFrameworkData,
  europeSelector,
  visaFrameworkData,
} from './config/visa-framework'

export default function VisaFinance() {
  const [selectedCountry, setSelectedCountry] = useState<Country>('usa')
  const [selectedEuropeCountry, setSelectedEuropeCountry] = useState<EuropeCountry>('germany')

  const [loanAmount, setLoanAmount] = useState(73706)
  const [interestRate, setInterestRate] = useState(8)
  const [loanTenure, setLoanTenure] = useState(10)

  const monthlyEMI = useMemo(() => {
    const principal = loanAmount
    const rate = interestRate / 100 / 12
    const months = loanTenure * 12

    if (rate === 0) return Math.round(principal / months)

    const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
    return Math.round(emi)
  }, [loanAmount, interestRate, loanTenure])

  const costItems = [
    { label: 'Tuition Fees', amount: '$45,000/year' },
    { label: 'Living Expenses', amount: '$20,000/year' },
    { label: 'Books & Supplies', amount: '$2,000/year' },
    { label: 'Health Insurance', amount: '$3,000/year' },
  ]

  const totalCost = 70000

  const isEurope = selectedCountry === 'europe'
  const currentFramework = isEurope ? europeFrameworkData[selectedEuropeCountry] : visaFrameworkData[selectedCountry]

  return (
    <section className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 dark:bg-black">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Visa & Financial Planning</h1>
        <p className="text-gray-600 dark:text-gray-400">Navigate visa requirements and plan your finances</p>
      </div>

      <div className="mb-6 rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
        <div className="flex flex-wrap justify-center gap-4">
          {countrySelector.map((country) => (
            <button
              key={country.value}
              onClick={() => setSelectedCountry(country.value)}
              className={`min-w-[120px] rounded-xl p-4 transition-all ${
                selectedCountry === country.value
                  ? 'bg-white shadow-md ring-2 ring-black dark:bg-gray-800 dark:ring-white'
                  : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl">{country.flag}</span>
                <span
                  className={`text-sm font-medium ${
                    selectedCountry === country.value
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {country.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
        {isEurope && (
          <div className="mb-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
              Europe Subsections
            </p>
            <div className="flex flex-wrap gap-2">
              {europeSelector.map((country) => (
                <button
                  key={country.value}
                  onClick={() => setSelectedEuropeCountry(country.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedEuropeCountry === country.value
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentFramework.name} Visa Framework</h2>
          <span className="inline-flex w-fit rounded-full bg-black px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-black">
            {currentFramework.visaFee}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Application Process</h3>
            </div>
            <div className="space-y-3">
              {currentFramework.process.map((step, index) => (
                <div key={step} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white dark:bg-white dark:text-black">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Documents Checklist</h3>
            </div>
            <div className="space-y-4">
              {currentFramework.checklist.map((group) => (
                <div key={group.title} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                    {group.title}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="mt-[2px] text-green-600 dark:text-green-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">Financial Planning Tools</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Calculate your expenses</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <h3 className="font-bold text-gray-900 dark:text-white">EMI Calculator</h3>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">Loan Amount ($)</label>
            <input
              type="range"
              min="10000"
              max="200000"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300 accent-black dark:bg-gray-700 dark:accent-white"
            />
            <p className="mt-2 font-semibold text-green-500">${loanAmount.toLocaleString()}</p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">Interest Rate (%)</label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300 accent-black dark:bg-gray-700 dark:accent-white"
            />
            <p className="mt-2 font-semibold text-green-500">{interestRate}%</p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">Loan Tenure (Years)</label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300 accent-black dark:bg-gray-700 dark:accent-white"
            />
            <p className="mt-2 font-semibold text-green-500">{loanTenure} years</p>
          </div>

          <div className="rounded-xl bg-black px-4 py-3 text-center text-white dark:bg-white dark:text-black">
            <span className="font-medium">Monthly EMI : </span>
            <span className="font-bold">${monthlyEMI.toLocaleString()}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <h3 className="font-bold text-gray-900 dark:text-white">Cost Estimator</h3>
          </div>

          <div className="space-y-4">
            {costItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-gray-200 py-2 last:border-0 dark:border-gray-700"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.amount}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-300 pt-4 dark:border-gray-600">
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
