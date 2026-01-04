"use client"

import { useState, useCallback } from "react"
import { X, Upload } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface GalleryUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  onFileUpload: (file: File) => Promise<string>
  onRemove: (imageUrl: string) => Promise<void>
  maxImages?: number
}

export function GalleryUpload({ images, onChange, onFileUpload, onRemove, maxImages = 10 }: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const handleFileSelection = useCallback(
    async (files: FileList) => {
      const remainingSlots = maxImages - images.length
      const filesToUpload = Array.from(files).slice(0, remainingSlots)

      if (filesToUpload.length === 0) {
        toast.error(`Maximum ${maxImages} images allowed`)
        return
      }

      setIsUploading(true)
      const uploadedUrls: string[] = []

      try {
        for (const file of filesToUpload) {
          if (!file.type.startsWith("image/")) {
            toast.error(`${file.name} is not an image file`)
            continue
          }

          setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))
          const imageUrl = await onFileUpload(file)
          uploadedUrls.push(imageUrl)
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
        }

        onChange([...images, ...uploadedUrls])
        toast.success(`${uploadedUrls.length} images uploaded successfully`)
      } catch (error) {
        console.error("Error uploading gallery images:", error)
        toast.error("Failed to upload some images")
      } finally {
        setIsUploading(false)
        setUploadProgress({})
      }
    },
    [images, maxImages, onChange, onFileUpload],
  )

  const handleRemove = useCallback(
    async (imageUrl: string) => {
      try {
        await onRemove(imageUrl)
        onChange(images.filter((url) => url !== imageUrl))
        toast.success("Image removed successfully")
      } catch (error) {
        console.error("Error removing image:", error)
        toast.error("Failed to remove image")
      }
    },
    [images, onChange, onRemove],
  )

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">University Gallery Images</label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square group">
            <Image
              src={image }
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <button
              type="button"
              onClick={() => handleRemove(image)}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="relative aspect-square cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleFileSelection(e.target.files)}
              disabled={isUploading}
            />
            <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-gray-300 hover:border-[#da212f] transition-colors p-4">
              {isUploading ? (
                <div className="w-full space-y-2">
                  {Object.entries(uploadProgress).map(([fileName, progress]) => (
                    <div key={fileName} className="text-sm text-gray-600">
                      <div className="flex justify-between mb-1">
                        <span>{fileName}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-[#3c387e] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 text-center">Upload Gallery Images</p>
                  <p className="text-xs text-gray-400 text-center">Drag and drop or click to upload</p>
                </>
              )}
            </div>
          </label>
        )}
      </div>

      <p className="text-xs text-gray-500">Upload up to {maxImages} images of university campus, facilities, etc.</p>
    </div>
  )
}

