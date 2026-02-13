'use client'

import { useState, useCallback, useEffect } from 'react'
import { Upload, Trash2, FileText, Loader, Eye } from 'lucide-react'
import { toast } from 'sonner'

type DocumentCategory = 'ACADEMIC' | 'PERSONAL' | 'FINANCIAL' | 'VISA' | 'PORTFOLIO' | 'OTHER'

interface Document {
  id: string
  name: string
  category: DocumentCategory
  fileType: string
  fileSize: number
  s3Url: string
  status: string
  uploadedAt: string
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState<DocumentCategory | 'ALL'>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('ACADEMIC')

  const categories: { value: DocumentCategory; label: string; color: string }[] = [
    { value: 'ACADEMIC', label: '🎓 Academic', color: 'bg-blue-100' },
    { value: 'PERSONAL', label: '👤 Personal', color: 'bg-purple-100' },
    { value: 'FINANCIAL', label: '💰 Financial', color: 'bg-green-100' },
    { value: 'VISA', label: '🛂 Visa', color: 'bg-orange-100' },
    { value: 'PORTFOLIO', label: '📁 Portfolio', color: 'bg-pink-100' },
    { value: 'OTHER', label: '📄 Other', color: 'bg-gray-100' },
  ]

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments()
  }, [])

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile/documents')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setDocuments(data)
    } catch (error) {
      toast.error('Failed to load documents')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Upload document
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File size exceeds 10MB limit')
      return
    }

    setUploading(true)
    try {
      // Upload to S3
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/s3/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const error = await uploadRes.json()
        throw new Error(error.error || 'Upload failed')
      }

      const { url, key } = await uploadRes.json()

      // Save to database
      const saveRes = await fetch('/api/profile/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          fileType: file.type,
          fileSize: file.size,
          category: selectedCategory,
          s3Key: key,
          s3Url: url,
        }),
      })

      if (!saveRes.ok) {
        const error = await saveRes.json()
        throw new Error(error.error || 'Save failed')
      }

      toast.success('Document uploaded successfully')
      await fetchDocuments()
      e.target.value = ''
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload document')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  // Delete document
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return

    try {
      const res = await fetch(`/api/profile/documents/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Delete failed')

      toast.success('Document deleted')
      setDocuments(documents.filter((d) => d.id !== id))
    } catch (error) {
      toast.error('Failed to delete document')
      console.error(error)
    }
  }

  const filteredDocs =
    filter === 'ALL' ? documents : documents.filter((d) => d.category === filter)

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📄 Documents</h1>
          <p className="text-gray-600 mt-1">Upload and manage your academic documents</p>
        </div>
        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Document</h2>

        <div className="space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <label key={cat.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={selectedCategory === cat.value}
                    onChange={() => setSelectedCategory(cat.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose File
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 transition bg-blue-50 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2 text-blue-600" />
                    Click to upload or drag and drop
                  </>
                )}
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-full font-medium transition whitespace-nowrap ${
            filter === 'ALL'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Documents
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-4 py-2 rounded-full font-medium transition whitespace-nowrap ${
              filter === cat.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold">
            Your Documents ({filteredDocs.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDocs.map((doc) => {
              const cat = categories.find((c) => c.value === doc.category)
              return (
                <div key={doc.id} className="px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded flex items-center justify-center text-lg ${cat?.color}`}>
                        {doc.fileType.includes('pdf') ? '📄' : '📋'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                          <span>{cat?.label}</span>
                          <span>•</span>
                          <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={doc.s3Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                      title="View document"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
