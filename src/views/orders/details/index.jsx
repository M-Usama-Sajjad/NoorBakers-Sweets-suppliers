'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Component Imports
import OrderDetailHeader from './OrderDetailHeader'
import OrderDetailsCard from './OrderDetailsCard'
import ShippingActivity from './ShippingActivityCard'
import CustomerDetails from './CustomerDetailsCard'
import ShippingAddress from './ShippingAddressCard'
import BillingAddress from './BillingAddressCard'
import Preview from '@/views/preview'

const OrderDetails = ({ orderData, order, setOrderData }) => {
  // State to control Preview card visibility
  const [showPreview, setShowPreview] = useState(false);

  // Handler to toggle Preview card visibility
  const handleTogglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <>
      <Grid container spacing={6}>
       
        <Grid size={{ xs: 12 }}>
          <OrderDetailHeader orderData={orderData} order={order} setOrderData={setOrderData} />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <OrderDetailsCard orderData={orderData} order={orderData.order} setOrderData={setOrderData} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ShippingActivity order={order} orderData={orderData} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <CustomerDetails orderData={orderData} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ShippingAddress orderData={orderData} order={orderData.order} />
            </Grid>
          </Grid>
        </Grid>
         <Grid size={{ xs: 12 }}>
          <Button variant="contained" onClick={handleTogglePreview}>
            {showPreview ? 'Hide Invoice' : 'See Invoice'}
          </Button>
        </Grid>
        {showPreview && (
          <Grid size={{ xs: 12 }}>
            <Preview orderData={orderData} />
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default OrderDetails
