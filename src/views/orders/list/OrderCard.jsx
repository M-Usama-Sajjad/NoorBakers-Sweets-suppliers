'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const OrderCard = ({ orderData }) => {
  console.log(orderData)

  // Hooks
  const isBelowMdScreen = useMediaQuery(theme => theme.breakpoints.down('md'))
  const isBelowSmScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))

  // Calculate status counts from orderData
  const statusCounts = {
    Returned: 0,
    Processing: 0,
    Delivered: 0,
    Cancelled: 0
  };

  // Count occurrences of each status
  orderData?.forEach(order => {
    if (order.status in statusCounts) {
      statusCounts[order.status]++;
    }
  });

  // Create data array for rendering
  const data = [
    {
      value: statusCounts.Returned,
      title: 'Returned',
      icon: 'tabler-wallet'
    },
    {
      value: statusCounts.Processing,
      title: 'Processing',
      icon: 'tabler-calendar-stats'
    },
    {
      value: statusCounts.Delivered,
      title: 'Delivered',
      icon: 'tabler-checks'
    },
    {
      value: statusCounts.Cancelled,
      title: 'Cancelled',
      icon: 'tabler-alert-octagon'
    }
  ];

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          {data.map((item, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              key={index}
              className={classnames({
                '[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie':
                  isBelowMdScreen && !isBelowSmScreen,
                '[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie': !isBelowMdScreen
              })}
            >
              <div className='flex justify-between gap-4'>
                <div className='flex flex-col items-start'>
                  <Typography variant='h4'>{item.value.toLocaleString()}</Typography>
                  <Typography>{item.title}</Typography>
                </div>
                <CustomAvatar variant='rounded' size={42} skin='light'>
                  <i className={classnames(item.icon, 'text-[26px]')} />
                </CustomAvatar>
              </div>
              {isBelowMdScreen && !isBelowSmScreen && index < data.length - 2 && (
                <Divider
                  className={classnames('mbs-6', {
                    'mie-6': index % 2 === 0
                  })}
                />
              )}
              {isBelowSmScreen && index < data.length - 1 && <Divider className='mbs-6' />}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default OrderCard
