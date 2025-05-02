'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'
import axios from 'axios'

const ProductOrganize = ({ productData, onChange }) => {
  // State for managing categories
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Handle adding a new category
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      onChange('category', newCategory.trim()); // Update the selected category
      setNewCategory(''); // Reset input
      setShowAddCategory(false); // Hide input field
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await axios.get('http://localhost:5001/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }) // Adjust the URL as needed
        
        // Extract unique categories from response.data.data
        const rawData = response?.data?.data || [];
        const uniqueCategories = [...new Set(rawData.map(item => item.category).filter(category => category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
  
    fetchCategories();
  }, []);

  return (
    <Card>
      <CardHeader title='Organize' />
      <CardContent>
        <form onSubmit={e => e.preventDefault()} className='flex flex-col gap-6'>
          <CustomTextField
            select
            fullWidth
            label='Type'
            value={productData.type}
            onChange={e => onChange('type', e.target.value)}
          >
            <MenuItem value=''>Select Type</MenuItem>
            <MenuItem value='Raw'>Raw</MenuItem>
            <MenuItem value='Ready'>Ready</MenuItem>
          </CustomTextField>
          <div className='flex items-end gap-4'>
            {!showAddCategory ? (
              <CustomTextField
                select
                fullWidth
                label='Category'
                value={productData.category || ''}
                onChange={e => onChange('category', e.target.value)}
              >
                <MenuItem value=''>Select Category</MenuItem>
                {categories?.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </CustomTextField>
            ) : (
              <CustomTextField
                fullWidth
                label='Add New Category'
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleAddCategory();
                    e.preventDefault();
                  }
                }}
                autoFocus
              />
            )}
            <CustomIconButton
              variant='tonal'
              color='primary'
              className='min-is-fit'
              onClick={() => {
                if (showAddCategory) {
                  handleAddCategory();
                } else {
                  setShowAddCategory(true);
                }
              }}
            >
              <i className='tabler-plus' />
            </CustomIconButton>
          </div>
          <CustomTextField
            select
            fullWidth
            label='Status'
            value={productData.status}
            onChange={e => onChange('status', e.target.value)}
          >
            <MenuItem value='active'>Active</MenuItem>
            <MenuItem value='inactive'>Inactive</MenuItem>
          </CustomTextField>
          <CustomTextField
            fullWidth
            label='Qty'
            placeholder='Quantity'
            value={productData.quantity}
            onChange={e => onChange('quantity', e.target.value)}
          />
          <CustomTextField
            fullWidth
            label='Manufacturing Date'
            type='date'
            value={productData.manufacturingDate}
            onChange={e => onChange('manufacturingDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <CustomTextField
            fullWidth
            label='Expiry Date'
            type='date'
            value={productData.expiryDate}
            onChange={e => onChange('expiryDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </form>
      </CardContent>
    </Card>
  )
}

export default ProductOrganize
