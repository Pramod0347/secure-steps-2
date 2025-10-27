'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // In a real application, you would upload to your storage service here
      const imageUrl = URL.createObjectURL(file)
      onChange(imageUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={`relative border-2 border-dashed rounded-lg ${className}`}>
      {value ? (
        <>
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover rounded-lg"
          />
          <button
            type="button"
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => onChange('')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm text-gray-500">
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </span>
        </label>
      )}
    </div>
  )
}

