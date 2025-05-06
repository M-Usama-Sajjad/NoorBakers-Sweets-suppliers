'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// Third-party Imports
import axios from '@/utils/axios'

// Component Imports
import ProductListTable from '@views/products/list/ProductListTable'
import ProductCard from '@views/products/list/ProductCard'
import Loader from '@/components/Loader'

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
        const response = await axios.get('/products/')
        console.log(response.data)
        // Map API data to table's expected format
        const mappedProducts = response?.data?.data?.map(product => ({
          id: product._id,
          productName: product.name,
          category: product.category,
          type: product.type,
          sku: product.sku || 'N/A',
          qty: product.quantity,
          status: product.status === 'active' ? 'Published' : product.status === 'expired' ? 'Inactive' : product.status,
          image: product?.productImage && product.productImage.startsWith('http')
          ? product.productImage
          : '/images/placeholder.png',          productBrand: product.productBrand || 'Unknown' // Placeholder
        }))

        setProducts(mappedProducts)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setError(error.response?.data?.message || 'Failed to fetch products')
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
        {loading ? <Loader message="Loading data..." />
          : (
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
