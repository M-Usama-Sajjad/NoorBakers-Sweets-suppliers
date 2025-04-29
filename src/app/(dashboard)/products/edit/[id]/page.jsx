'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// Third-party Imports
import axios from 'axios'

// Component Imports
import ProductAddHeader from '@views/products/edit/ProductAddHeader'
import ProductInformation from '@views/products/edit/ProductInformation'
import ProductImage from '@views/products/edit/ProductImage'
import ProductVariants from '@views/products/edit/ProductVariants'
import ProductInventory from '@views/products/edit/ProductInventory'
import ProductPricing from '@views/products/edit/ProductPricing'
import ProductOrganize from '@views/products/edit/ProductOrganize'
import RawProductToggleTable from '@views/products/edit/RawProductToggleTable'

// Data Fetching Function
const fetchProduct = async (id, token) => {
  try {
    const response = await axios.get(`http://localhost:5001/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log('Raw API response:', response.data)
    return response.data.data // Adjust for nested 'data' property
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product')
  }
}

const EditProduct = () => {
  // Get product ID from URL params
  const { id } = useParams()

  // State for product form data
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    barcode: '',
    category: '',
    materialType: 'active',
    status: '',
    quantity: '',
    manufacturingDate: '',
    expiryDate: '',
    subCategory: '',
    supplier: '6805693ab8aac0a3c71ae84a',
    unit: 'pieces',
    price: 0,
    minStockLevel: 0,
    expiryDays: 30,
    location: 'supplier',
    batchNumber: 'BATCH001',
    isActive: true,
    sku: ''
  })

  // State for snackbar
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch product data on mount
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setSuccess(false)
      setMessage('No authentication token found. Please log in.')
      setOpen(true)
      setLoading(false)
      return
    }

    if (id) {
      fetchProduct(id, token)
        .then((product) => {
          const newProductData = {
            name: product.name || '',
            description: product.description || '',
            barcode: product.barcode || '',
            category: product.type || '',
            materialType: product.materialType || 'active',
            status: product.status || '',
            quantity: product.quantity?.toString() || '', // Convert number to string for input
            manufacturingDate: product.manufacturingDate ? new Date(product.manufacturingDate).toISOString().split('T')[0] : '',
            expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : '',
            subCategory: product.category || '',
            supplier: product.supplier?._id || '6805693ab8aac0a3c71ae84a',
            unit: product.unit || 'pieces',
            price: product.price || 0,
            minStockLevel: product.minStockLevel || 0,
            expiryDays: product.expiryDays || 30,
            location: product.location || 'supplier',
            batchNumber: product.batchNumber || 'BATCH001',
            isActive: product.isActive !== undefined ? product.isActive : true,
            sku: product.sku || '',
            productImage: productData.productImage || undefined

          }
          console.log('New productData:', newProductData)
          setProductData(newProductData)
          setLoading(false)
        })
        .catch((error) => {
          setSuccess(false)
          setMessage(error.message)
          setOpen(true)
          setLoading(false)
        })
    }
  }, [id])

  // Handle form data changes
  const handleChange = (field, value) => {
    setProductData(prev => ({ ...prev, [field]: value }))
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setSuccess(false)
        setMessage('No authentication token found. Please log in.')
        setOpen(true)
        return
      }

      const payload = {
        name: productData.name,
        description: productData.description,
        type: productData.category,
        category: productData.subCategory,
        materialType: productData.category === 'Raw' ? productData.materialType : undefined,
        supplier: productData.supplier,
        unit: productData.unit,
        price: Number(productData.price),
        minStockLevel: Number(productData.minStockLevel),
        expiryDays: Number(productData.expiryDays),
        barcode: productData.barcode || undefined,
        quantity: Number(productData.quantity) || 0,
        location: productData.location,
        batchNumber: productData.batchNumber,
        manufacturingDate: productData.manufacturingDate || undefined,
        expiryDate: productData.expiryDate || undefined,
        status: productData.status,
        isActive: productData.isActive,
        sku: productData.sku || undefined,
        productImage: productData.productImage || undefined

      }

      const response = await axios.patch(`http://localhost:5001/api/products/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setSuccess(true)
      setMessage('Product updated successfully!')
      setOpen(true)
    } catch (error) {
      setSuccess(false)
      setMessage(error.response?.data?.message || 'Failed to update product')
      setOpen(true)
    }
  }

  // Handle snackbar close
  const handleClose = () => {
    setOpen(false)
  }
  const handleImageUpload = (imageUrl) => {
    setProductData(prev => ({ ...prev, productImage: imageUrl }))
  }

  // Mock product data for RawProductToggleTable
  const data = { products: [] }

  console.log('Render productData:', productData)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <ProductAddHeader />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <ProductInformation productData={productData} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ProductImage onImageUpload={handleImageUpload}/>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <RawProductToggleTable productData={data?.products} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <ProductOrganize productData={productData} onChange={handleChange} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Button variant='contained' color='primary' onClick={handleSubmit} sx={{ mt: 6, ml: 6 }}>
        Update Product
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default EditProduct
