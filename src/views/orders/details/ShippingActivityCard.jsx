'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import MuiTimeline from '@mui/lab/Timeline'

// Styled Timeline component
const Timeline = styled(MuiTimeline)({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    },
    '& .MuiTimelineContent-root:last-child': {
      paddingBottom: 0
    },
    '&:nth-last-child(2) .MuiTimelineConnector-root': {
      backgroundColor: 'transparent',
      borderInlineStart: '1px dashed var(--mui-palette-divider)'
    },
    '& .MuiTimelineConnector-root': {
      backgroundColor: 'var(--mui-palette-primary-main)'
    }
  }
})

const ShippingActivity = ({ order, orderData }) => {
  // Function to format changedAt timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.toLocaleString('en-US', { weekday: 'long' });
    const time = date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${day} ${time}`;
  };

  return (
    <Card>
      <CardHeader title='Order History' />
      <CardContent>
        <Timeline>
          {/* Initial order placed item */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='primary' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                <Typography color='text.primary' className='font-medium'>
                  Order was placed (Order ID: #{order})
                </Typography>
                <Typography variant='caption'>Tuesday 11:29 AM</Typography>
              </div>
              <Typography className='mbe-2'>Your order has been placed successfully</Typography>
            </TimelineContent>
          </TimelineItem>
          {/* Dynamic history items */}
          {orderData?.history?.map((history, index) => (
            <TimelineItem key={history._id || index }>
              <TimelineSeparator>
                <TimelineDot color={index === orderData.history.length - 1 ? 'secondary' : 'primary'} />
                {index < orderData.history.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                  <Typography color='text.primary' className='font-medium'>
                    {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                  </Typography>
                  <Typography variant='caption'>{formatTimestamp(history.changedAt)}</Typography>
                </div>
                <Typography className='mbe-2'>
                  {history.changedBy ? `Status changed by ${history.changedBy}` : 'Status updated'}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  )
}

export default ShippingActivity
