import { useState, useEffect } from 'react'

export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/csrf')
      .then(res => res.json())
      .then(data => setCsrfToken(data.token))
  }, [])

  return csrfToken
} 