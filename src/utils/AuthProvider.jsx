'use client'

// React Imports
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

// Third-party Imports
import axios from 'axios'
import { login } from '@/libs/redux/actions/authActions'

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        const initializeAuth = async () => {
            // Check for token in localStorage
            const token = localStorage.getItem('token')

            if (token) {
                try {
                    // Fetch user data from backend
                    const response = await axios.get('http://localhost:5001/api/auth/me', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })

                    if (response.data.success && response.data.user) {
                        // Dispatch token and user data to Redux
                        console.log("User data fetched successfully:", response.data.user)
                        dispatch(login(token, response.data.user))
                    } else {
                        console.error('Failed to fetch user data:', response.data.message)
                        // Optionally clear invalid token
                        localStorage.removeItem('token')
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error.response?.data?.message || error.message)
                    // Optionally clear invalid token
                    // localStorage.removeItem('token')
                }
            }
        }

        initializeAuth()
    }, [dispatch])

    return <>{children}</>
}

export default AuthProvider
