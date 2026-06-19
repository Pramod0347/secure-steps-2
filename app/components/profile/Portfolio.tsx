'use client'

import { useCallback, useEffect, useState } from 'react'
import { ExternalLink, FileText, Loader2, RefreshCw, SlidersHorizontal } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

type PortfolioDocument = {
  id: string
  name: string
  originalName: string
  s3Url: string
  description?: string | null
  category?: string | null
  section?: string | null
  order?: number
}

type PortfolioItemResponse = {
  id: string
  title: string
  description?: string | null
  category?: string | null
  section?: string | null
  attachmentUrl?: string | null
  order?: number
}

export default function Portfolio() {
  const [documents, setDocuments] = useState<PortfolioDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [activeDocument, setActiveDocument] = useState<PortfolioDocument | null>(null)

  const loadPortfolio = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile/portfolio')
      if (!res.ok) {
        setDocuments([])
        return
      }

      const data: PortfolioItemResponse[] = await res.json()
      const apiDocuments = data
        .filter((item) => (item.section === 'PORTFOLIO' || item.category === 'PORTFOLIO') && Boolean(item.attachmentUrl))
        .map((item) => ({
          id: item.id,
          name: item.title,
          originalName: item.title,
          s3Url: item.attachmentUrl as string,
          description: item.description || null,
          category: item.category,
          section: item.section,
          order: item.order,
        }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name))

      setDocuments(apiDocuments)
    } catch (error) {
      console.error(error)
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPortfolio()
  }, [loadPortfolio])

  return (
    <section className="min-h-screen bg-white p-8 dark:bg-black">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Portfolio Builder
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Portfolio PDFs attached to the `PORTFOLIO` section.
          </p>
        </div>

        <button
          onClick={loadPortfolio}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </button>
      </div>

      <div className="mb-8 rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          Why Do You Need a Portfolio
        </h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          A well-crafted portfolio showcases your unique story, achievements, and potential. It helps admissions officers understand who you are beyond grades and test scores.
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            'Highlight your personal brand and values',
            'Demonstrate your skills and experiences',
            'Show your growth and future aspirations',
            'Stand out from other applicants',
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-black dark:bg-white">
                <span className="text-[10px] font-bold text-white dark:text-black">✓</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <SlidersHorizontal className="h-4 w-4" />
          Showing portfolio PDFs only
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-500">
          {documents.length} file{documents.length === 1 ? '' : 's'}
        </div>
      </div>

      {loading ? (
        <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      ) : documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center dark:border-gray-800">
          <FileText className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            No portfolio PDFs found
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((doc) => (
            <PortfolioCard key={doc.id} doc={doc} onOpen={() => setActiveDocument(doc)} />
          ))}
        </div>
      )}

      <Dialog open={Boolean(activeDocument)} onOpenChange={(open) => !open && setActiveDocument(null)}>
        <DialogContent className="h-[90vh] w-[94vw] max-w-6xl overflow-hidden p-0">
          <DialogTitle className="sr-only">
            {activeDocument ? `${activeDocument.name || activeDocument.originalName || 'Portfolio PDF'}` : 'Portfolio PDF'}
          </DialogTitle>

          {activeDocument ? (
            <div className="flex h-full flex-col bg-neutral-950">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Portfolio PDF</p>
                  <h3 className="mt-1 text-sm font-semibold">
                    {activeDocument.name || activeDocument.originalName || 'Portfolio PDF'}
                  </h3>
                </div>
                <a
                  href={activeDocument.s3Url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/20"
                >
                  Open in new tab
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="min-h-0 flex-1 bg-zinc-100 p-3 dark:bg-neutral-900">
                <iframe
                  src={activeDocument.s3Url}
                  title={activeDocument.name || activeDocument.originalName || 'Portfolio PDF'}
                  className="h-full w-full rounded-2xl border border-black/10 bg-white"
                />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}

function PortfolioCard({ doc, onOpen }: { doc: PortfolioDocument; onOpen: () => void }) {
  const displayName = doc.name || doc.originalName || 'Portfolio PDF'

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700">
      <div className="relative bg-gray-50 dark:bg-gray-900">
        <iframe
          src={doc.s3Url}
          title={`${displayName} preview`}
          loading="lazy"
          className="relative z-0 h-44 w-full bg-white dark:bg-gray-950"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
        <button
          type="button"
          onClick={onOpen}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-sm backdrop-blur transition hover:bg-white dark:bg-gray-950/90 dark:text-gray-200 dark:hover:bg-gray-900"
        >
          Preview
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-white">
            {displayName}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PDF document
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left transition hover:border-gray-300 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800"
        >
          <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            Open in popup
          </span>
          <ExternalLink className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
        </button>
      </div>
    </article>
  )
}
