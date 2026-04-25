import { type InputHTMLAttributes, forwardRef } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, ...props }, ref) => {
  const normalizedProps = { ...props }
  if ("value" in normalizedProps && (normalizedProps.value === undefined || normalizedProps.value === null)) {
    normalizedProps.value = ""
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...normalizedProps}
      />
    </div>
  )
})
Input.displayName = "Input"
