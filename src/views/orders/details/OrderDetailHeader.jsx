'use client'

// MUI Imports
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// Component Imports
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

export const paymentStatus = {
  1: { text: 'Paid', color: 'success' },
  2: { text: 'Pending', color: 'warning' },
  3: { text: 'Cancelled', color: 'secondary' },
  4: { text: 'Failed', color: 'error' }
}

export const statusChipColor = {
  Delivered: { color: 'success' },
  'Out for Delivery': { color: 'primary' },
  'Ready to Pickup': { color: 'info' },
  Dispatched: { color: 'warning' }
}

const OrderDetailHeader = ({ orderData, order }) => {
  // Log props for debugging
  console.log('OrderDetailHeader props:', { orderData, order })

  // Vars
  const buttonProps = (children, color, variant) => ({
    children,
    color,
    variant
  })

  // Fallback for status chip color
  const getStatusColor = (status) => {
    return statusChipColor[status]?.color || 'default' // Fallback to 'default'
  }
    console.log('OrderDetailHeader orderData:', orderData.status)
  return (
    <div className='flex flex-wrap justify-between sm:items-center max-sm:flex-col gap-y-4'>
      <div className='flex flex-col items-start gap-1'>
        <div className='flex items-center gap-2'>
          <Typography variant='h5'>{`Order #${order}`}</Typography>
          <Chip
            variant='tonal'
            label={orderData?.status || 'Unknown'}
            color={getStatusColor(orderData?.status)}
            size='small'
          />
          {/* <Chip
            variant='tonal'
            label={paymentStatus[orderData?.payment ?? 2].text}
            color={paymentStatus[orderData?.payment ?? 2].color}
            size='small'
          /> */}
        </div>
        <Typography>{`${new Date(orderData?.date ?? '').toDateString()}, ${orderData?.time} (ET)`}</Typography>
      </div>
      {/* <OpenDialogOnElementClick
        element={Button}
        elementProps={buttonProps('Delete Order', 'error', 'tonal')}
        dialog={ConfirmationDialog}
        dialogProps={{ type: 'delete-order' }}
      /> */}
    </div>
  )
}

export default OrderDetailHeader
