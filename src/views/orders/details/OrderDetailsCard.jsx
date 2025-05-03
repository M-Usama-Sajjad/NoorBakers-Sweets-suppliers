'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Axios
import axios from '@/utils/axios'

// Component Imports
import Link from '@components/Link'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const OrderTable = ({ orderData, order, setOrderData }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  // Transform orderData.products to match expected structure
  const tableData = useMemo(() => {
    return orderData.products.map(item => ({
      productName: item.product,
      brand: 'Generic',
      price: item.price,
      quantity: item.quantity,
      total: (item.price * item.quantity).toFixed(2)
    }))
  }, [orderData.products])

  // Define columnHelper
  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('productName', {
        header: 'Product',
        cell: ({ row }) => (
          <div className='flex flex-col items-start'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.productName}
            </Typography>
            <Typography variant='body2'>{row.original.brand}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: ({ row }) => <Typography>{`$${row.original.price.toFixed(2)}`}</Typography>
      }),
      columnHelper.accessor('quantity', {
        header: 'Qty',
        cell: ({ row }) => <Typography>{`${row.original.quantity}`}</Typography>
      }),
      columnHelper.accessor('total', {
        header: 'Total',
        cell: ({ row }) => <Typography>{`$${row.original.total}`}</Typography>
      })
    ],
    []
  )

  const table = useReactTable({
    data: tableData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <div className='overflow-x-auto'>
      <table className={tableStyles.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={classnames({
                        'flex items-center': header.column.getIsSorted(),
                        'cursor-pointer select-none': header.column.getCanSort()
                      })}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <i className='tabler-chevron-up text-xl' />,
                        desc: <i className='tabler-chevron-down text-xl' />
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {table.getFilteredRowModel().rows.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                No data available
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody className='border-be'>
            {table
              .getRowModel()
              .rows.slice(0, table.getState().pagination.pageSize)
              .map(row => (
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        )}
      </table>
    </div>
  )
}

const OrderDetailsCard = ({ orderData, order, setOrderData }) => {
  const [newStatus, setNewStatus] = useState(orderData?.status || 'processing')
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState(null)
  const [updatedStatus, setUpdatedStatus] = useState(orderData?.status)
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState('')

  const canUpdateStatus = updatedStatus !== 'cancelled' && updatedStatus !== 'delivered'

  const handleUpdateStatus = async () => {
    setUpdateLoading(true)
    setUpdateError(null)

    try {
      const response = await axios.put(`/orders/${orderData.id}/status`, { status: newStatus })

      setOrderData({ ...orderData, status: newStatus })
      setUpdateLoading(false)
      setSuccess(true)
      setMessage(`Order status updated to ${newStatus}`)
      setOpen(true)
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update status')
      setUpdateLoading(false)
      setSuccess(false)
      setMessage(err.response?.data?.message || 'Failed to update status')
      setOpen(true)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  // Compute totals from products
  const subtotal = orderData.products.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  const shippingFee = 2
  const tax = 28
  const total = orderData.totalAmount.toFixed(2)

  return (
    <>
      <Card>
        <CardHeader
          title='Order Details'
          action={
            <Typography component={Link} color='primary.main' className='font-medium'>
              Edit
            </Typography>
          }
        />
        <OrderTable orderData={orderData} order={order} />
        <CardContent>
          <Box className='flex justify-between items-center mb-4'>
            <Typography color='text.primary'>Status: {updatedStatus}</Typography>
            {canUpdateStatus && (
              <Box display='flex' alignItems='center' gap={2}>
                <FormControl size='small'>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newStatus}
                    label='Status'
                    onChange={e => setNewStatus(e.target.value)}
                    disabled={updateLoading}
                  >
                    <MenuItem value='processing'>Processing</MenuItem>
                    <MenuItem value='delivered'>Delivered</MenuItem>
                    <MenuItem value='cancelled'>Cancelled</MenuItem>
                    <MenuItem value='returned'>Returned</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant='contained'
                  onClick={handleUpdateStatus}
                  disabled={updateLoading || newStatus === updatedStatus}
                >
                  {updateLoading ? <CircularProgress size={24} /> : 'Update Status'}
                </Button>
              </Box>
            )}
          </Box>
          {updateError && (
            <Typography color='error' align='center' sx={{ mb: 2 }}>
              {updateError}
            </Typography>
          )}
          <Box className='flex justify-end'>
            <div>
              <div className='flex items-center gap-12'>
                <Typography color='text.primary' className='min-is-[100px]'>
                  Subtotal:
                </Typography>
                <Typography color='text.primary' className='font-medium'>
                  ${subtotal}
                </Typography>
              </div>
              <div className='flex items-center gap-12'>
                <Typography color='text.primary' className='min-is-[100px]'>
                  Shipping Fee:
                </Typography>
                <Typography color='text.primary' className='font-medium'>
                  ${shippingFee}
                </Typography>
              </div>
              <div className='flex items-center gap-12'>
                <Typography color='text.primary' className='min-is-[100px]'>
                  Tax:
                </Typography>
                <Typography color='text.primary' className='font-medium'>
                  ${tax}
                </Typography>
              </div>
              <div className='flex items-center gap-12'>
                <Typography color='text.primary' className='font-medium min-is-[100px]'>
                  Total:
                </Typography>
                <Typography color='text.primary' className='font-medium'>
                  ${total}
                </Typography>
              </div>
            </div>
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default OrderDetailsCard
