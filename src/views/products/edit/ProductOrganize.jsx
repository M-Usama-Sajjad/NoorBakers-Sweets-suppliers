'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

const ProductOrganize = ({ productData, onChange }) => {
  return (
    <Card>
      <CardHeader title='Organize' />
      <CardContent>
        <form onSubmit={e => e.preventDefault()} className='flex flex-col gap-6'>
          <CustomTextField
            select
            fullWidth
            label='Type'
            value={productData.category || ''}
            onChange={e => onChange('category', e.target.value)}
          >
            <MenuItem value=''>Select Type</MenuItem>
            <MenuItem value='Raw'>Raw</MenuItem>
            <MenuItem value='Ready'>Ready</MenuItem>
          </CustomTextField>
          <div className='flex items-end gap-4'>
            <CustomTextField
              select
              fullWidth
              label='Category'
              value={productData.subCategory || ''}
              onChange={e => onChange('subCategory', e.target.value)}
            >
              <MenuItem value=''>Select Category</MenuItem>
              <MenuItem value='Pastries'>Pastries</MenuItem>
              <MenuItem value='Bread'>Bread</MenuItem>
              <MenuItem value='Cakes'>Cakes</MenuItem>
              <MenuItem value='Cookies'>Cookies</MenuItem>
              <MenuItem value='Pies'>Pies</MenuItem>
              <MenuItem value='Muffins'>Muffins</MenuItem>
            </CustomTextField>
            <CustomIconButton variant='tonal' color='primary' className='min-is-fit'>
              <i className='tabler-plus' />
            </CustomIconButton>
          </div>
          <CustomTextField
            select
            fullWidth
            label='Status'
            value={productData.status || ''}
            onChange={e => onChange('status', e.target.value)}
          >
            <MenuItem value='active'>Active</MenuItem>
            <MenuItem value='inactive'>Inactive</MenuItem>
          </CustomTextField>
          <CustomTextField
            fullWidth
            label='Qty'
            placeholder='Quantity'
            type='number'
            value={productData.quantity || ''}
            onChange={e => onChange('quantity', e.target.value)}
          />
          <CustomTextField
            fullWidth
            label='Manufacturing Date'
            type='date'
            value={productData.manufacturingDate ? productData.manufacturingDate.split('T')[0] : ''}
            onChange={e => onChange('manufacturingDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <CustomTextField
            fullWidth
            label='Expiry Date'
            type='date'
            value={productData.expiryDate ? productData.expiryDate.split('T')[0] : ''}
            onChange={e => onChange('expiryDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </form>
      </CardContent>
    </Card>
  )
}

export default ProductOrganize
