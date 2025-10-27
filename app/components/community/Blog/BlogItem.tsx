"use client"

import { useState } from "react"
import { FileText, Trash2, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogItemProps {
  url: string
  fileName: string
  uploadDate: string
  onDelete: (url: string) => Promise<void>
}

export function BlogItem({ url, fileName, uploadDate, onDelete }: BlogItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(url)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="bg-muted p-2 rounded">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium">{fileName}</h3>
          <p className="text-sm text-muted-foreground">{uploadDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" >
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-1" />
            View
          </a>
        </Button>
        <Button  size="sm" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
