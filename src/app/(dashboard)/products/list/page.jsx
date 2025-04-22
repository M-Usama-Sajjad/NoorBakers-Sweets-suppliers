'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// Third-party Imports
import axios from 'axios'

// Component Imports
import ProductListTable from '@views/products/list/ProductListTable'
import ProductCard from '@views/products/list/ProductCard'

const eCommerceProductsList = () => {
  // State for product data, loading, and errors
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found. Please log in.')
        }

        const response = await axios.get('http://localhost:5001/api/products/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
         console.log(response.data)
        // Map API data to table's expected format
        const mappedProducts = response?.data?.data?.map(product => ({          id: product._id,
          productName: product.name,
          category: product.category,
          type:product.type,
          sku: product.sku || 'N/A',
          qty: product.quantity,
          status: product.status === 'active' ? 'Published' : product.status === 'expired' ? 'Inactive' : product.status,
          image: product.image || '/images/placeholder.png', // Placeholder if no image
          productBrand: product.productBrand || 'Unknown' // Placeholder
        }))

        setProducts(mappedProducts)
        setLoading(false)
      } catch (err) {
        setError(err.message || 'Failed to fetch products')
        setSnackbarOpen(true)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <ProductCard />
        </Grid>
        <Grid size={{ xs: 12 }}>
          {loading ? (
           " Loading products..."
          ) : (
            <ProductListTable productData={products} />
          )}
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  )
}

export default eCommerceProductsList
