// components/core/file-upload/index.tsx
import React, { useCallback, type ReactNode } from 'react'
import { useDropzone, type DropzoneOptions } from 'react-dropzone'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
  value: File[] | null
  onValueChange: (files: File[] | null) => void
  dropzoneOptions?: DropzoneOptions
  className?: string
  children: ReactNode
}

export function FileUploader({

  onValueChange,
  dropzoneOptions,
  className,
  children
}: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onValueChange(acceptedFiles)
    },
    [onValueChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...dropzoneOptions,
    onDrop
  })

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        'relative rounded-lg',
        isDragActive && 'bg-primary/5',
        className
      )}
    >
      <input {...getInputProps()} />
      {children}
    </div>
  )
}

interface FileInputProps {
  className?: string
  children: ReactNode
}

export function FileInput({ className, children }: FileInputProps) {
  return (
    <div className={cn('rounded-lg cursor-pointer', className)}>
      {children}
    </div>
  )
}

interface FileUploaderContentProps {
  className?: string
  children: ReactNode
}

export function FileUploaderContent({ className, children }: FileUploaderContentProps) {
  return (
    <div className={cn('mt-2 space-y-1', className)}>
      {children}
    </div>
  )
}

interface FileUploaderItemProps {
  index: number
  className?: string
  children: ReactNode
}

export function FileUploaderItem({ className, children }: FileUploaderItemProps) {
  return (
    <div className={cn('flex items-center gap-2 rounded-md px-3 py-2 text-xs', className)}>
      {children}
    </div>
  )
}