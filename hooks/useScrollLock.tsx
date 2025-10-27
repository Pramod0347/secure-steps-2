// hooks/useScrollLock.ts
import { useEffect } from 'react'

export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (lock) {
      // Save the current overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow
      
      // Apply the lock
      document.body.style.overflow = 'hidden'
      
      // Cleanup function to restore original style
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [lock]) // Only re-run if lock changes
}