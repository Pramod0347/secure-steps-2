'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Check, SlidersHorizontal } from 'lucide-react'

type TemplateCategory = 'all' | 'skills' | 'experience' | 'personal'

interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory[]
  thumbnail: string
}

// Sample templates data
const templates: Template[] = [
  {
    id: '1',
    name: 'Technical Skills Showcase',
    description: 'Perfect for showcasing your skills and achievements',
    category: ['all', 'skills'],
    thumbnail: '/portfolio-templates/template-1.png',
  },
  {
    id: '2',
    name: 'Technical Skills Showcase',
    description: 'Perfect for showcasing your skills and achievements',
    category: ['all', 'skills'],
    thumbnail: '/portfolio-templates/template-2.png',
  },
  {
    id: '3',
    name: 'Technical Skills Showcase',
    description: 'Perfect for showcasing your skills and achievements',
    category: ['all', 'skills'],
    thumbnail: '/portfolio-templates/template-3.png',
  },
  {
    id: '4',
    name: 'Technical Skills Showcase',
    description: 'Perfect for showcasing your skills and achievements',
    category: ['all', 'experience'],
    thumbnail: '/portfolio-templates/template-4.png',
  },
  {
    id: '5',
    name: 'Technical Skills Showcase',
    description: 'Perfect for showcasing your skills and achievements',
    category: ['all', 'experience'],
    thumbnail: '/portfolio-templates/template-5.png',
  },
  {
    id: '6',
    name: 'Technical Skills Showcase',
    description: 'Perfect for showcasing your skills and achievements',
    category: ['all', 'experience'],
    thumbnail: '/portfolio-templates/template-6.png',
  },
  {
    id: '7',
    name: 'Technical Skills Showcase',
    description: 'Perfect for showcasing your skills and achievements',
    category: ['all', 'personal'],
    thumbnail: '/portfolio-templates/template-7.png',
  },
  {
    id: '8',
    name: 'Technical Skills Showcase',
    description: 'Perfect for showcasing your skills and achievements',
    category: ['all', 'personal'],
    thumbnail: '/portfolio-templates/template-8.png',
  },
  {
    id: '9',
    name: 'Technical Skills Showcase',
    description: 'Perfect for showcasing your skills and achievements',
    category: ['all', 'personal'],
    thumbnail: '/portfolio-templates/template-9.png',
  },
]

const benefits = [
  'Highlight your personal brand and values',
  'Demonstrate your skills and experiences',
  'Show your growth and future aspirations',
  'Stand out from other applicants',
]

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all')

  const categories: { value: TemplateCategory; label: string }[] = [
    { value: 'all', label: 'All Templates' },
    { value: 'skills', label: 'Skills' },
    { value: 'experience', label: 'Experience' },
    { value: 'personal', label: 'Personal' },
  ]

  const filteredTemplates = activeCategory === 'all'
    ? templates
    : templates.filter(t => t.category.includes(activeCategory))

  return (
    <section className="p-8 bg-white dark:bg-black min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Portfolio Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create a compelling portfolio with our 50+ templates
        </p>
      </div>

      {/* Why Portfolio Section */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Why Do You Need a Portfolio
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          A well-crafted portfolio showcases your unique story, achievements, and potential. It helps admissions officers understand who you are beyond grades and test scores.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-black dark:bg-white flex items-center justify-center">
                <Check className="w-3 h-3 text-white dark:text-black" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.value
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </section>
  )
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="group cursor-pointer">
      {/* Template Preview */}
      <div className="relative aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden mb-3 border border-gray-200 dark:border-gray-800">
        {/* Placeholder for template thumbnail */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-2xl font-light italic text-gray-400 mb-1">
              fabrica<sup className="text-xs">®</sup>
            </div>
            <div className="text-[10px] text-gray-500 tracking-widest">Studio</div>
          </div>
          {/* World map overlay effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
          </div>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
            Use Template
          </button>
        </div>
      </div>
      
      {/* Template Info */}
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
        {template.name}
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {template.description}
      </p>
    </div>
  )
}
