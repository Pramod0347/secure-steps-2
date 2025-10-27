"use client"

import { useState } from "react"
import { FileText, Calendar, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogCardProps {
  url: string
  fileName: string
  uploadDate: string
  onClick: () => void
  onPreview: () => void
}

export default function BlogCard({ url, fileName, uploadDate, onClick, onPreview }: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false)

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

  // Generate a random color for the PDF cover
  const getRandomColor = () => {
    const colors = [
      "bg-orange-500",
      "bg-blue-500",
      "bg-red-500",
      "bg-emerald-500",
      "bg-purple-500",
      "bg-amber-500",
      "bg-rose-500",
    ]

    // Use a hash of the filename to get a consistent color for the same file
    const hashCode = (str: string) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      return Math.abs(hash)
    }

    const colorIndex = hashCode(fileName || "default") % colors.length
    return colors[colorIndex]
  }

  return (
    <div
      className="group relative h-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* PDF Cover */}
      <div className={`relative h-[200px] w-full overflow-hidden ${getRandomColor()}`}>
        <div className="absolute inset-0 bg-black/10"></div>

        {/* PDF Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-lg bg-white/90 p-4 shadow-lg">
            <FileText className="h-12 w-12 text-gray-800" />
          </div>
        </div>

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
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
