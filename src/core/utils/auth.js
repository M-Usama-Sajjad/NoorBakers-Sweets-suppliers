export const setToken = (token) => {
    // Stores token in localStorage when user logs in
    if (typeof window !== 'undefined') {
        localStorage.setItem('userToken', token)
    }
}

export const getToken = () => {
    // Retrieves token from localStorage
    // Returns null if no token exists or if running on server
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userToken')
    }
    return null
}

export const removeToken = () => {
    // Removes token from localStorage during logout
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userToken')
    }
}

// Helper to quickly check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken()
}
