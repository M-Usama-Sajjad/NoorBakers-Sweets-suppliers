'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// Third-party Imports
import axios from '@/utils/axios'

// Component Imports
import ProductAddHeader from '@views/products/add/ProductAddHeader'
import ProductInformation from '@views/products/add/ProductInformation'
import ProductImage from '@views/products/add/ProductImage'
import ProductVariants from '@views/products/add/ProductVariants'
import ProductInventory from '@views/products/add/ProductInventory'
import ProductPricing from '@views/products/add/ProductPricing'
import ProductOrganize from '@views/products/add/ProductOrganize'
import RawProductToggleTable from '@views/products/add/RawProductToggleTable'
import SkinDefault from '@/@core/svg/SkinDefault'

const eCommerceProductsAdd = () => {
  // State for product form data
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    barcode: '',
    type: '',
    category: '', // Maps to schema's 'type' (Raw or Ready)
    materialType: 'active', // Default for type: Raw
    status: '',
    quantity: '',
    manufacturingDate: '',
    expiryDate: '',
    subCategory: '', // Maps to schema's 'category' (e.g., Pastries)
    // Required fields with defaults
    supplier: '6805693ab8aac0a3c71ae84a', // Replace with authenticated supplier ID if needed
    unit: 'pieces',
    price: 0,
    minStockLevel: 0,
    expiryDays: 30,
    location: 'supplier',
    batchNumber: 'BATCH001',
    isActive: true,
    productImage: null
  })
 console.log(productData.status)
  // State for snackbar
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState('')

  // Handle form data changes
  const handleChange = (field, value) => {
    setProductData(prev => ({ ...prev, [field]: value }))
  }

  // Handle image upload
  const handleImageUpload = (imageUrl) => {
    setProductData(prev => ({ ...prev, productImage: imageUrl }))
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const payload = {
        name: productData.name,
        description: productData.description,
        type: productData.type,
        category: productData.category,
        subCategory: productData.category || "RassMalai",
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
        status: productData.status || undefined,
        isActive: productData.isActive,
        sku: productData.sku || undefined,
        productImage: productData.productImage || undefined
      }

      console.log('Submitting payload:', payload) // For debugging

      const response = await axios.post('/products/', payload)

      setSuccess(true)
      setMessage('Product added successfully!')
      setOpen(true)
    } catch (error) {
      console.error('Submission error:', error)
      setSuccess(false)
      setMessage(error.response?.data?.message || 'Failed to add product')
      setOpen(true)
    }
  }

  // Handle snackbar close
  const handleClose = () => {
    setOpen(false)
  }

  // Mock product data (replace with actual data fetching if needed)
  const data = { products: [] }

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
              <ProductImage onImageUpload={handleImageUpload} />
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
        Add Product
      </Button>
            <Grid size={{ xs: 12 }}>
              <RawProductToggleTable productData={productData} />
            </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default eCommerceProductsAdd
