// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import './print.css'

// Vars


const PreviewCard = ({ orderData }) => {
  return (
    <Card className='previewCard'>
      <CardContent className='sm:!p-12'>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <div className='p-6 bg-actionHover rounded'>
              <div className='flex justify-between gap-y-4 flex-col sm:flex-row'>
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center gap-2.5 '>
                    <Typography variant='h5' className='font-bold'>
                      Noor Bakers & Sweets
                    </Typography>
                  </div>
                  {/* <div>
                    <Typography color='text.primary'>Office 149, 450 South Brand Brooklyn</Typography>
                    <Typography color='text.primary'>San Diego County, CA 91905, USA</Typography>
                    <Typography color='text.primary'>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
                  </div> */}
                </div>
                <div className='flex flex-col gap-6'>
                  <Typography variant='h5'>{`Invoice #${orderData.order}`}</Typography>
                  <div className='flex flex-col gap-1'>
                    <Typography color='text.primary'>{`Order Date: ${orderData?.date}`}</Typography>
                    {/* <Typography color='text.primary'>{`Date Due: ${invoiceData?.dueDate}`}</Typography> */}
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Invoice To:
                  </Typography>
                  <div>
                    <Typography>{orderData?.customer}</Typography>
                    <Typography>{orderData?.company}</Typography>
                    <Typography>{orderData?.address}</Typography>
                    <Typography>{orderData?.phone}</Typography>
                    <Typography>{orderData?.email}</Typography>
                  </div>
                </div>
              </Grid>
              {/* <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Bill To:
                  </Typography>
                  <div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Total Due:</Typography>
                      <Typography>$12,110.55</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Bank name:</Typography>
                      <Typography>American Bank</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Country:</Typography>
                      <Typography>United States</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>IBAN:</Typography>
                      <Typography>ETD95476213874685</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>SWIFT code:</Typography>
                      <Typography>BR91905</Typography>
                    </div>
                  </div>
                </div>
              </Grid> */}
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className='overflow-x-auto border rounded'>
              <table className={tableStyles.table}>
                <thead className='border-bs-0'>
                  <tr>
                    <th className='!bg-transparent'>Item</th>
                    <th className='!bg-transparent'>Description</th>
                    {/* <th className='!bg-transparent'>Hours</th> */}
                    <th className='!bg-transparent'>Qty</th>
                    {/* <th className='!bg-transparent'>Total</th> */}
                  </tr>
                </thead>
                <tbody>
                  {orderData.products.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Typography color='text.primary'>{item?.product}</Typography>
                      </td>
                      <td>
                        <Typography color='text.primary'>{orderData?.notes}</Typography>
                      </td>
                      {/* <td>
                        <Typography color='text.primary'>{item?.Hours}</Typography>
                      </td> */}
                      <td>
                        <Typography color='text.primary'>{item?.quantity}</Typography>
                      </td>
                      {/* <td>
                        <Typography color='text.primary'>{item?.Total}</Typography>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>
          {/* <Grid size={{ xs: 12 }}>
            <div className='flex justify-between flex-col gap-y-4 sm:flex-row'>
              <div className='flex flex-col gap-1 order-2 sm:order-[unset]'>
                <div className='flex items-center gap-2'>
                  <Typography className='font-medium' color='text.primary'>
                    Salesperson:
                  </Typography>
                  <Typography>Tommy Shelby</Typography>
                </div>
                <Typography>Thanks for your business</Typography>
              </div>
              <div className='min-is-[200px]'>
                <div className='flex items-center justify-between'>
                  <Typography>Subtotal:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    $1800
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Discount:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    $28
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Tax:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    21%
                  </Typography>
                </div>
                <Divider className='mlb-2' />
                <div className='flex items-center justify-between'>
                  <Typography>Total:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    $1690
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider className='border-dashed' />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography>
              <Typography component='span' className='font-medium' color='text.primary'>
                Note:
              </Typography>{' '}
              It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance
              projects. Thank You!
            </Typography>
          </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PreviewCard
