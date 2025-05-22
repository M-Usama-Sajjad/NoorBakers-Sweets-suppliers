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
import OrderCard from './OrderCard'
import OrderListTable from './OrderListTable'
import Loader from '@/components/Loader'

const OrderList = () => {
  // States
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found. Please log in.')
        }

        const response = await axios.get('/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const orders = response.data.data.map(order => ({
          id: order._id,
          order: order.orderNumber,
          date: new Date(order.createdAt),
          time: new Date(order.createdAt).toLocaleTimeString(),
          customer: order.shopkeeper?.name || 'Unknown',
          email: order.shopkeeper?.email || '',
          avatar: null, // No avatar in schema
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1) // Capitalize status
        }))

        setOrderData(orders)
        setLoading(false)
      } catch (error) {
        setMessage(error.response?.data?.message || 'Failed to fetch orders')
        setOpen(true)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Handle snackbar close
  const handleClose = () => {
    setOpen(false)
  }

  if (loading) {
    return (
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <OrderCard />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Loader message='Loading orders...' />  
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <OrderCard orderData={orderData} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <OrderListTable orderData={orderData} />
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default OrderList
