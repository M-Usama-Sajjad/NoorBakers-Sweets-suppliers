// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import OrderDetailHeader from './OrderDetailHeader'
import OrderDetailsCard from './OrderDetailsCard'
import ShippingActivity from './ShippingActivityCard'
import CustomerDetails from './CustomerDetailsCard'
import ShippingAddress from './ShippingAddressCard'
import BillingAddress from './BillingAddressCard'

const OrderDetails = ({ orderData, order, setOrderData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <OrderDetailHeader orderData={orderData} order={order} setOrderData={setOrderData} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <OrderDetailsCard orderData={orderData} order={orderData.order} setOrderData={setOrderData}/>
          </Grid>
          {/* <Grid size={{ xs: 12 }}>
            <ShippingActivity order={order} />
          </Grid> */}
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
          {/* <Grid size={{ xs: 12 }}>
            <BillingAddress />
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default OrderDetails
