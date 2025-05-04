import axios from 'axios'

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // This is important for cookies
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  config => {
    // Skip token for login route
    if (config.url.includes('/auth/login')) {
      return config
    }

    // Skip token for image upload routes
    if (config.url.includes('/upload')) {
      return config
    }

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.error('Response error:', error)
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
