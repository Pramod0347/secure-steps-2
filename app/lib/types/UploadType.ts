// lib/types/upload.ts
export type UploadType = 'banner' | 'logo' | 'gallery' | 'document'

export interface UploadResponse {
  url: string
  error?: string
}

export interface UploadConfig {
  maxSize: number
  allowedTypes: string[]
  folder: string
}

export const UPLOAD_CONFIGS: Record<UploadType, UploadConfig> = {
  banner: {
    maxSize: 4 * 1024 * 1024, // 4MB
    allowedTypes: ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
    folder: 'universities/banners/'
  },
  logo: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['.png', '.jpg', '.jpeg', '.svg'],
    folder: 'universities/logos/'
  },
  gallery: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['.png', '.jpg', '.jpeg', '.gif'],
    folder: 'universities/gallery/'
  },
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['.pdf', '.doc', '.docx'],
    folder: 'universities/documents/'
  }
}

// Development fallback URLs
export const DEV_UPLOAD_URLS: Record<UploadType, string> = {
  banner: 'https://placehold.co/1200x400',
  logo: 'https://placehold.co/400x400',
  gallery: 'https://placehold.co/600x400',
  document: 'https://example.com/sample.pdf'
}

// Helper functions
export const isValidFileType = (file: File, type: UploadType): boolean => {
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  return UPLOAD_CONFIGS[type].allowedTypes.includes(fileExtension)
}

export const isValidFileSize = (file: File, type: UploadType): boolean => {
  return file.size <= UPLOAD_CONFIGS[type].maxSize
}