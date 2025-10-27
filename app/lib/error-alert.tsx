// app/components/ui/error-alert.tsx
'use client'

interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

export function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-red-700">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-red-700 hover:text-red-900"
        >
          ✕
        </button>
      </div>
    </div>
  );
}