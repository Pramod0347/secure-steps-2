"use client"

import type React from "react"
import { useState, useCallback, useEffect, forwardRef } from "react"
import { X, Upload } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value: File | null
  onChange: (file: File | null) => void
  onRemove: () => Promise<void>
  label?: string
  maxSize?: number
  className?: string
  onError?: (error: string) => void
  type: "banner" | "logo" | "gallery" | "course" 
  currentUrl?: string
  onProgress?: (progress: number) => void
}

const typeConfig = {
  banner: {
    height: "h-[200px]",
    text: "Upload Banner Image",
    accept: "image/jpeg,image/png",
  },
  logo: {
    height: "h-[200px]",
    text: "Upload University Logo",
    accept: "image/jpeg,image/png,image/svg+xml",
  },
  gallery: {
    height: "h-[150px]",
    text: "Upload Gallery Image",
    accept: "image/jpeg,image/png",
  },
  course: {
    height: "h-[150px]",
    text: "Upload Course Image",
    accept: "image/jpeg,image/png",
  },
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      onChange,
      onRemove,
      label,
      maxSize = 4 * 1024 * 1024,
      className = "",
      onError,
      type,
      currentUrl,
      value,
      onProgress,
    },
    ref,
  ) => {
    const [preview, setPreview] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [uploadController, setUploadController] = useState<AbortController | null>(null)

    console.log("preview :",preview);

    useEffect(() => {
      if (currentUrl) {
        setPreview(currentUrl)
      } else if (value instanceof File) {
        const previewUrl = URL.createObjectURL(value)
        setPreview(previewUrl)
        return () => URL.revokeObjectURL(previewUrl)
      } else {
        setPreview(null)
      }
    }, [currentUrl, value])

    const handleFileSelection = useCallback(
      async (file: File) => {
        if (file.size > maxSize) {
          onError?.(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`)
          return
        }

        if (!file.type.startsWith("image/")) {
          onError?.("Please upload an image file")
          return
        }

        setIsUploading(true)
        setProgress(0)
        const controller = new AbortController()
        setUploadController(controller)

        try {
          const formData = new FormData()
          formData.append("file", file)
          // Map the component type to API expected type
          formData.append("type", "image") // Always send "image" for image uploads

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            signal: controller.signal,
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Upload failed" }))
            throw new Error(errorData.error || "Upload failed")
          }

          const result = await response.json()
          
          // Check if the response has the expected URL field
          const imageUrl = result.url || result.imageUrl
          if (!imageUrl) {
            throw new Error("No URL returned from server")
          }

          setPreview(imageUrl)
          onChange(file)
          console.log(`${type} image uploaded:`, imageUrl)
          toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded successfully`)
          onProgress?.(100)
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            console.log("Upload cancelled")
            toast.info("Upload cancelled")
          } else {
            console.error(`Error uploading ${type} image:`, error)
            toast.error(`Failed to upload ${type} image`)
            onError?.(error instanceof Error ? error.message : "Upload failed")
          }
        } finally {
          setIsUploading(false)
          setProgress(0)
          setUploadController(null)
        }
      },
      [maxSize, onChange, onError, type, onProgress],
    )

    const handleDrop = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(false)
        const file = event.dataTransfer.files[0]
        if (file) handleFileSelection(file)
      },
      [handleFileSelection],
    )

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback(() => {
      setIsDragging(false)
    }, [])

    const handleRemove = useCallback(async () => {
      try {
        // First update the UI state
        setPreview(null)
        onChange(null)
        setProgress(0)

        // Then try to remove from server
        await onRemove()
      } catch (error) {
        console.error("Error removing image:", error)
        toast.error("Failed to remove image from server")
        // We don't re-throw the error here to ensure the UI stays updated
      }
    }, [onChange, onRemove])

    const handleCancelUpload = useCallback(() => {
      if (uploadController) {
        uploadController.abort()
        setIsUploading(false)
        setProgress(0)
      }
    }, [uploadController])

    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

        <div
          className={`relative rounded-lg overflow-hidden border-2 border-dashed transition-colors ${
            isDragging ? "border-[#3c387e] bg-[#3c387e]/5" : "border-gray-300"
          } ${typeConfig[type].height}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative w-full h-full group">
              <Image
                src={preview || "https://cdn.britannica.com/85/13085-050-C2E88389/Corpus-Christi-College-University-of-Cambridge-England.jpg"}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center flex-col w-full h-full cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept={typeConfig[type].accept}
                onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                disabled={isUploading}
                ref={ref}
              />
              <div className="text-center p-4 space-y-2">
                {isUploading ? (
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Uploading...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-[#3c387e] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <Button onClick={handleCancelUpload} variant="outline" size="sm">
                      Cancel Upload
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600">{typeConfig[type].text}</p>
                    <p className="text-xs text-gray-400">Drag and drop or click to upload</p>
                  </>
                )}
              </div>
            </label>
          )}
        </div>
      </div>
    )
  },
)

ImageUpload.displayName = "ImageUpload";