'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { Edit2, ExternalLink, FileText, Loader2, RefreshCw, Save, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'

type PortfolioItem = {
  id: string
  title: string
  description?: string | null
  category?: string | null
  section?: string | null
  attachmentUrl?: string | null
  imageUrl?: string | null
  order: number
}

type SectionOption = {
  value: string
  label: string
}

const SECTION_OPTIONS: SectionOption[] = [
  { value: 'PORTFOLIO', label: 'Portfolio' },
  { value: 'DOCUMENTS', label: 'Documents' },
  { value: 'JOURNEY', label: 'Journey Roadmap' },
  { value: 'APPLICATIONS', label: 'Applications' },
  { value: 'VISA', label: 'Visa & Finance' },
  { value: 'EBOOKS', label: 'E-Books' },
]

const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024

export default function ContentManager() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [section, setSection] = useState('PORTFOLIO')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const loadItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile/portfolio')
      if (!res.ok) {
        throw new Error('Failed to load portfolio items')
      }

      const data: PortfolioItem[] = await res.json()
      setItems(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load content records')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const groupedCounts = useMemo(() => {
    return items.reduce<Record<string, number>>((acc, item) => {
      const key = item.section || item.category || 'UNCATEGORIZED'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  }, [items])

  const handleUpload = async () => {
    if (!file) {
      toast.error('Select a PDF first')
      return
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
      toast.error('PDF size should be less than 20MB')
      return
    }

    const uploadTitle = title.trim() || file.name.replace(/\.pdf$/i, '')

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'pdf')

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const error = await uploadRes.json()
        if (uploadRes.status === 413) {
          throw new Error(error.error || 'File is too large for upload')
        }
        throw new Error(error.error || 'PDF upload failed')
      }

      const uploadData = await uploadRes.json()

      const saveRes = await fetch('/api/profile/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          description: description.trim() || null,
          category: section,
          section,
          imageUrl: null,
          attachmentUrl: uploadData.url,
          order: items.length,
        }),
      })

      if (!saveRes.ok) {
        const error = await saveRes.json()
        throw new Error(error.error || 'Failed to save content')
      }

      toast.success('Content uploaded')
      setTitle('')
      setDescription('')
      setFile(null)
      setSection('PORTFOLIO')
      await loadItems()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed'
      toast.error(message)
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return

    try {
      const res = await fetch(`/api/profile/portfolio/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Delete failed')
      }

      toast.success('Content deleted')
      await loadItems()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Delete failed'
      toast.error(message)
      console.error(error)
    }
  }

  const handleSave = async (item: PortfolioItem) => {
    try {
      const res = await fetch(`/api/profile/portfolio/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          category: item.category,
          section: item.section,
          imageUrl: item.imageUrl,
          attachmentUrl: item.attachmentUrl,
          order: item.order,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Update failed')
      }

      toast.success('Content updated')
      setEditingId(null)
      await loadItems()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed'
      toast.error(message)
      console.error(error)
    }
  }

  if (!isAdmin) {
    return (
      <section className="min-h-screen rounded-2xl bg-white p-8 dark:bg-black">
        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
          <FileText className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Access restricted
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Content Manager is available only for admin users.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-white p-8 dark:bg-black">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Content Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload files and attach them to a section like `PORTFOLIO`.
          </p>
        </div>

        <button
          onClick={loadItems}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </button>
      </div>

      <div className="mb-8 grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-950 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Section
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white"
            >
              {SECTION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Content title"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              PDF File
            </label>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800 dark:text-gray-300 dark:file:bg-white dark:file:text-black"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={7}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white"
          />

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading...' : 'Upload Content'}
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SECTION_OPTIONS.map((option) => (
          <div key={option.value} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">{option.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {groupedCounts[option.value] || 0}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center dark:border-gray-800">
            <FileText className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              No content items found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload the first item to the selected section.
            </p>
          </div>
        ) : (
          items.map((item) => {
            const isEditing = editingId === item.id
            const currentSection = item.section || item.category || 'UNCATEGORIZED'
            return (
              <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        {isEditing ? (
                          <input
                            value={item.title}
                            onChange={(e) => {
                              const next = e.target.value
                              setItems((prev) => prev.map((row) => row.id === item.id ? { ...row, title: next } : row))
                            }}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                          />
                        ) : (
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Section: {currentSection}
                        </p>
                      </div>
                    </div>

                    {isEditing ? (
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => {
                          const next = e.target.value
                          setItems((prev) => prev.map((row) => row.id === item.id ? { ...row, description: next } : row))
                        }}
                        rows={3}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                      />
                    ) : item.description ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                    ) : null}

                    {isEditing ? (
                      <select
                        value={item.section || item.category || 'PORTFOLIO'}
                        onChange={(e) => {
                          const next = e.target.value
                          setItems((prev) => prev.map((row) => row.id === item.id ? { ...row, section: next, category: next } : row))
                        }}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                      >
                        {SECTION_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {isEditing ? (
                      <button
                        onClick={() => handleSave(item)}
                        className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Save
                      </button>
                    ) : (
                      <a
                        href={item.attachmentUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </a>
                    )}

                    <button
                      onClick={() => setEditingId(isEditing ? null : item.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      {isEditing ? 'Close' : 'Edit'}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
