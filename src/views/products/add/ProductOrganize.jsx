'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

const ProductOrganize = () => {
  // States
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [collection, setCollection] = useState('')
  const [status, setStatus] = useState('')

  return (
    <Card>
      <CardHeader title='Organize' />
      <CardContent>
        <form onSubmit={e => e.preventDefault()} className='flex flex-col gap-6'>
          <CustomTextField select fullWidth label='Type' value={type} onChange={e => setType(e.target.value)}>
          <MenuItem value=''>Select Type</MenuItem>
            <MenuItem value='Raw'>Raw</MenuItem> // Updated values to match data
            <MenuItem value='Ready'>Ready</MenuItem> // Updated values to match data
          </CustomTextField>
          <div className='flex items-end gap-4'>
            <CustomTextField
              select
              fullWidth
              label='Category'
              value={category}
              onChange={e => setCategory(e.target.value)}
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
          {/* <CustomTextField
            select
            fullWidth
            label='Collection'
            value={collection}
            onChange={e => setCollection(e.target.value)}
          >
            <MenuItem value={`Men's Clothing`}>Men&apos;s Clothing</MenuItem>
            <MenuItem value={`Women's Clothing`}>Women&apos;s Clothing</MenuItem>
            <MenuItem value={`Kid's Clothing`}>Kid&apos;s Clothing</MenuItem>
          </CustomTextField> */}
          <CustomTextField select fullWidth label='Status' value={status} onChange={e => setStatus(e.target.value)}>
            <MenuItem value='Published'>Active</MenuItem>
            <MenuItem value='Inactive'>Inactive</MenuItem>
          </CustomTextField>
          <CustomTextField fullWidth label='Qty' placeholder='Quantity' />
        </form>
      </CardContent>
    </Card>
  )
}

export default ProductOrganize
