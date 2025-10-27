"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden" // Disable background scrolling
      document.addEventListener("mousedown", handleOutsideClick)
      document.addEventListener("keydown", handleEscapeKey)
    } else {
      document.body.style.overflow = "" // Enable scrolling when modal closes
    }

    return () => {
      document.body.style.overflow = "" // Cleanup
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed w-screen h-full top-0 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col"
      >
        {/* Sticky Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}
