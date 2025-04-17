'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const AuthCheck = () => {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const token = localStorage.getItem('userToken')
        const isLoginPage = pathname === '/login'

        if (token && isLoginPage) {
            router.replace('/home')
        } else if (!token && !isLoginPage) {
            router.replace('/login')
        }
    }, [pathname])

    return null
}

export default AuthCheck
