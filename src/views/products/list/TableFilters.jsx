// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const TableFilters = ({ setData, productData }) => {
  // States
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [type, setType] = useState('')

  useEffect(() => {
    const filteredData = productData?.filter(product => {
      // Filter by category
      if (category && product.category !== category) return false

      // Filter by stock status based on product.qty
      if (stock) {
        const isInStock = product.qty > 0
        if (stock === 'In Stock' && !isInStock) return false
        if (stock === 'Out of Stock' && isInStock) return false
      }

      // Filter by type
      if (type && product.type !== type) return false

      return true
    })

    setData(filteredData ?? [])
  }, [category, stock, type, productData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-type'
            value={type}
            onChange={e => setType(e.target.value)}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Type</MenuItem>
            <MenuItem value='Raw'>Raw</MenuItem>
            <MenuItem value='Ready'>Ready</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-category'
            value={category}
            onChange={e => setCategory(e.target.value)}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Category</MenuItem>
            <MenuItem value='Pastries'>Pastries</MenuItem>
            <MenuItem value='Bread'>Bread</MenuItem>
            <MenuItem value='Cakes'>Cakes</MenuItem>
            <MenuItem value='Cookies'>Cookies</MenuItem>
            <MenuItem value='Pies'>Pies</MenuItem>
            <MenuItem value='Muffins'>Muffins</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-stock'
            value={stock}
            onChange={e => setStock(e.target.value)}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Stock</MenuItem>
            <MenuItem value='In Stock'>In Stock</MenuItem>
            <MenuItem value='Out of Stock'>Out of Stock</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
