'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Check if token is present in localStorage
    if (localStorage.getItem('token') == null) {
      // Redirect to /login if token exists
      router.push('/login')
    }
  }, [])

  // Render the page only if no redirect occurs
  return <h1>Home page!</h1>
}
