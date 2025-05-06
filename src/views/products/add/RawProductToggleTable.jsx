'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'

// Component Imports
import RawProductListTable from '@/views/products/list/RawProductListTable'

const RawProductToggleTable = ({ onChange, onRawItemsChange }) => {
  const [isChecked, setIsChecked] = useState(false)

  // Update convertRawToReady when isChecked changes
  useEffect(() => {
    if (typeof onChange === 'function') {
      console.log('Updating convertRawToReady:', isChecked) // Debugging
      onChange('convertRawToReady', isChecked)
    }
  }, [isChecked])

  return (
    <Grid size={{ xs: 12 }}>
      <FormControlLabel
        control={<Checkbox checked={isChecked} onChange={e => setIsChecked(e.target.checked)} />}
        label={
          <Typography variant='h6'>
            {isChecked ? 'Convert Raw to Ready' : 'Convert Raw to Ready'}
          </Typography>
        }
      />
      {isChecked && <RawProductListTable onRawItemsChange={onRawItemsChange} />}
    </Grid>
  )
}

export default RawProductToggleTable
