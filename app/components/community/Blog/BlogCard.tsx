"use client"

import { Calendar, Download, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogCardProps {
  url: string
  fileName: string
  uploadDate: string
  thumbnail?: string | null
  onClick: () => void
  onPreview: () => void
}

export default function BlogCard({ url, fileName, uploadDate, thumbnail, onClick, onPreview }: BlogCardProps) {
  // Format the title from filename
  const formatTitle = (fileName: string) => {
    if (!fileName) return "Untitled Blog"

    return fileName
      .replace(/\.pdf$/i, "")
      .replace(/-/g, " ")
      .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
  }

  // Format the date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      console.error("Error formatting date:", e)
      return "Invalid date"
    }
  }

  return (
    <div
      className="group relative h-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative h-[200px] w-full overflow-hidden bg-gray-100">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`${formatTitle(fileName)} cover`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-rose-50">
            <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
              <FileText className="h-12 w-12 text-slate-600" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/15" />

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            size="sm"
            className="flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation()
              onPreview()
            }}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-semibold">{formatTitle(fileName)}</h3>

        <div className="mt-2 flex items-center text-gray-500">
          <Calendar className="mr-1.5 h-3.5 w-3.5" />
          <span className="text-sm">{formatDate(uploadDate)}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onPreview()
            }}
          >
            <Eye className="mr-1.5 h-4 w-4" />
            View
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              const link = document.createElement("a")
              link.href = url
              link.download = fileName
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            <Download className="mr-1.5 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}
