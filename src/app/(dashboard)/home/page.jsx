'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material'

// Chart.js Imports
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Axios
import axios from 'axios'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

export default function Page() {
  const router = useRouter()
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const rawData = response.data
        console.log('Raw data:', rawData)
        let normalized = []

        if (Array.isArray(rawData)) {
          normalized = rawData
        } else if (Array.isArray(rawData?.data)) {
          normalized = rawData.data
        } else if (rawData?.data) {
          normalized = [rawData.data]
        } else if (Array.isArray(rawData?.orders)) {
          normalized = rawData.orders
        }

        const mapped = normalized
          .filter(order => order && order._id && (order.createdAt || order.updatedAt))
          .map(order => {
            const shopkeeper = order.shopkeeper || {}
            return {
              id: order._id,
              date: order.createdAt || order.updatedAt,
              status: order.status,
              orderNumber: order.orderNumber,
              customer: shopkeeper.name || 'Unknown',
              avatar: shopkeeper.avatar || null,
              email: shopkeeper.email || '',
            }
          })

        console.log('Mapped orderData:', mapped)
        setOrderData(mapped)
        setLoading(false)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to fetch orders')
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router])

  const orderStats = useMemo(() => {
    const now = new Date('2025-04-30')
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    const yearStart = new Date(now.getFullYear(), 0, 1)

    const stats = {
      currentMonth: 0,
      lastMonth: 0,
      yearly: 0,
      total: orderData.length,
      delivered: 0,
      cancelled: 0,
      returned: 0,
      processing: 0,
      pending: 0, // Add pending
    }

    orderData.forEach(order => {
      const orderDate = new Date(order.date)
      console.log('Order date:', order.date, 'Parsed date:', orderDate)
      if (isNaN(orderDate)) return

      if (orderDate >= currentMonthStart && orderDate <= now) {
        stats.currentMonth++
        console.log('Current month order:', order)
      }
      if (orderDate >= lastMonthStart && orderDate <= lastMonthEnd) {
        stats.lastMonth++
        console.log('Last month order:', order)
      }
      if (orderDate >= yearStart && orderDate <= now) {
        stats.yearly++
        console.log('Yearly order:', order)
      }
      switch (order.status) {
        case 'delivered':
          stats.delivered++
          break
        case 'cancelled':
          stats.cancelled++
          break
        case 'returned':
          stats.returned++
          break
        case 'processing':
          stats.processing++
          break
        case 'pending':
          stats.pending++ // Count pending orders
          break
      }
    })

    console.log('Order stats:', stats)
    return stats
  }, [orderData])

  const chartData = {
    labels: ['Current Month', 'Last Month', 'Yearly'],
    datasets: [
      {
        label: 'Number of Orders',
        data: [
          orderStats.currentMonth,
          orderStats.lastMonth,
          orderStats.yearly,
        ],
        backgroundColor: ['#3f51b5', '#ff9800', '#4caf50'],
        borderColor: ['#3f51b5', '#ff9800', '#4caf50'],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Order Comparison (2025)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Orders' },
      },
      x: {
        title: { display: true, text: 'Time Period' },
      },
    },
  }

  const pieChartData = {
    labels: ['Delivered', 'Cancelled', 'Returned', 'Processing', 'Pending'], // Add Pending
    datasets: [
      {
        label: 'Order Status Breakdown',
        data: [
          orderStats.delivered,
          orderStats.cancelled,
          orderStats.returned,
          orderStats.processing,
          orderStats.pending, // Add pending data
        ],
        backgroundColor: [
          '#4caf50', // Delivered (green)
          '#f44336', // Cancelled (red)
          '#ff9800', // Returned (orange)
          '#3f51b5', // Processing (blue)
          '#9c27b0', // Pending (purple)
        ],
        borderColor: [
          '#388e3c',
          '#d32f2f',
          '#f57c00',
          '#303f9f',
          '#7b1fa2', // Pending border
        ],
        borderWidth: 1,
      },
    ],
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Order Status Breakdown',
      },
    },
  }

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
        </Box>
      )
    }

    if (error) {
      return (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )
    }

    return (
      <>
        {orderData.length > 0 ? (
          <Box sx={{ height: 400 }}>
            <Bar data={chartData} options={chartOptions} />
          </Box>
        ) : (
          <Typography color="text.secondary" align="center">
            No order data available
          </Typography>
        )}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body1" className='mt-10'>
            Total Orders: {orderStats.total}
          </Typography>
          <Typography variant="body1">
            Delivered Orders: {orderStats.delivered}
          </Typography>
          <Typography variant="body1">
            Pending Orders: {orderStats.pending}
          </Typography>
          <Typography variant="body1">
            Orders in processing: {orderStats.processing}
          </Typography>
        </Box>
        <Box sx={{ mt: 4, height: 400 }}>
          <Pie data={pieChartData} options={pieChartOptions} />
        </Box>
      </>
    )
  }

  return (
    <>
      <Card sx={{ mt: 4 }}>
        <CardHeader
          title="Order Comparison"
          subheader="Current Month vs. Last Month vs. Yearly"
        />
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </>
  )
}
