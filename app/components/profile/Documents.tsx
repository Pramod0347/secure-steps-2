'use client'

import { useState } from 'react'
import { Upload, FileText, Eye, Trash2 } from 'lucide-react'

type DocumentCategory = 'ACADEMIC' | 'PERSONAL' | 'FINANCIAL' | 'VISA' | 'PORTFOLIO' | 'OTHER'

interface Document {
  id: string
  name: string
  category: DocumentCategory
  fileType: string
  fileSize: number
  uploadedAt: string
}

export default function Documents() {
  const [filter, setFilter] = useState<DocumentCategory | 'ALL'>('ALL')

  const categories: { value: DocumentCategory; label: string; color: string }[] = [
    { value: 'ACADEMIC', label: '🎓 Academic', color: 'bg-blue-100 dark:bg-blue-900/30' },
    { value: 'PERSONAL', label: '👤 Personal', color: 'bg-purple-100 dark:bg-purple-900/30' },
    { value: 'FINANCIAL', label: '💰 Financial', color: 'bg-green-100 dark:bg-green-900/30' },
    { value: 'VISA', label: '🛂 Visa', color: 'bg-orange-100 dark:bg-orange-900/30' },
    { value: 'PORTFOLIO', label: '📁 Portfolio', color: 'bg-pink-100 dark:bg-pink-900/30' },
    { value: 'OTHER', label: '📄 Other', color: 'bg-gray-100 dark:bg-gray-800' },
  ]

  // Dummy documents for display
  const dummyDocuments: Document[] = [
    { id: '1', name: 'Transcript.pdf', category: 'ACADEMIC', fileType: 'application/pdf', fileSize: 245000, uploadedAt: '2026-02-15' },
    { id: '2', name: 'Passport.pdf', category: 'PERSONAL', fileType: 'application/pdf', fileSize: 1200000, uploadedAt: '2026-02-10' },
    { id: '3', name: 'Bank_Statement.pdf', category: 'FINANCIAL', fileType: 'application/pdf', fileSize: 890000, uploadedAt: '2026-02-08' },
    { id: '4', name: 'SOP_Draft.docx', category: 'PORTFOLIO', fileType: 'application/docx', fileSize: 45000, uploadedAt: '2026-02-20' },
  ]

  const filteredDocuments = filter === 'ALL' 
    ? dummyDocuments 
    : dummyDocuments.filter(doc => doc.category === filter)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <section className="p-8 bg-white dark:bg-black min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Documents
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and organize your application documents
        </p>
      </div>

      {/* Upload Area */}
      <div className="mb-8">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)
            </p>
          </div>
          <input type="file" className="hidden" disabled />
        </label>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          Document upload coming soon
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'ALL'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat.value
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : `${cat.color} text-gray-700 dark:text-gray-300 hover:opacity-80`
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => {
          const category = categories.find(c => c.value === doc.category)
          return (
            <div
              key={doc.id}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-lg ${category?.color || 'bg-gray-100'}`}>
                  <FileText className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatFileSize(doc.fileSize)} • {formatDate(doc.uploadedAt)}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${category?.color} text-gray-700 dark:text-gray-300`}>
                    {category?.label}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
                <button className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-500 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No documents found</p>
        </div>
      )}
    </section>
  )
}
