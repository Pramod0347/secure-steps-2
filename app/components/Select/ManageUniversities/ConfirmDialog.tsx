"use client"

import { useEffect, useRef, useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onCancel()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onCancel])

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      await onConfirm()
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div ref={dialogRef} className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative z-[1000]">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#DA202E]" />
              <p className="mt-2 text-sm text-gray-500">Processing...</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">{message}</p>
          )}
        </div>
        <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3">
          {!isProcessing && (
            <>
              <Button
                onClick={onCancel}
                variant="outline"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {cancelLabel}
              </Button>
              <Button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                {confirmLabel}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

