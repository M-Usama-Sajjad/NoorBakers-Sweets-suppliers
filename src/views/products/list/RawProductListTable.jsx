'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import CustomTextField from '@core/components/mui/TextField'
import InputAdornment from '@mui/material/InputAdornment'

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
import axios from 'axios'

// Component Imports
import TablePaginationComponent from '@components/TablePaginationComponent'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { MenuItem } from '@mui/material'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)
    return () => clearTimeout(timeout)
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper()

const RawProductListTable = () => {
  // States
  const [data, setData] = useState([]) // Store fetched products
  const [filteredData, setFilteredData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [inputValues, setInputValues] = useState({}) // State to store input values for each product
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Hooks
  const { lang: locale } = useParams()

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await axios.get('http://localhost:5001/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const rawData = response?.data?.data
        console.log('Fetched products:', rawData)

        // Normalize data (handle different response structures)
        let products = []
        if (Array.isArray(rawData)) {
          products = rawData
        } else if (Array.isArray(rawData?.data)) {
          products = rawData.data
        } else if (Array.isArray(rawData?.products)) {
          products = rawData.products
        }

        // Filter for Raw products and map to expected format
        const rawProducts = products
          .filter(product => product.type === 'Raw')
          .map(product => ({
            id: product._id || product.id,
            productName: product.name || product.productName,
          }))

        setData(rawProducts)
        setFilteredData(rawProducts)
        setLoading(false)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err.response?.data?.message || 'Failed to fetch products')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const columns = useMemo(
    () => [
      columnHelper.accessor('input', {
        header: 'Weight (kg)',
        cell: ({ row }) => (
          <CustomTextField
            type='number'
            value={inputValues[row.original.id] || ''} // Use product ID as key
            onChange={e => {
              const value = e.target.value
              // Allow empty string or valid decimal numbers (e.g., "0.1", "0.5")
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setInputValues(prev => ({
                  ...prev,
                  [row.original.id]: value
                }))
              }
            }}
            inputProps={{ min: 0, step: 0.1 }} // Allow decimals with step of 0.1
            InputProps={{
              endAdornment: <InputAdornment position='end'>kg</InputAdornment> // Add "kg" unit
            }}
            sx={{ width: '100px' }} // Adjust width to accommodate "kg"
          />
        ),
        enableSorting: false // Disable sorting for this column
      }),
      columnHelper.accessor('productName', {
        header: 'Raw Product Name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.productName}
          </Typography>
        )
      })
    ],
    [data, filteredData, inputValues] // Add inputValues to dependencies
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  if (loading) {
    return (
      <Card>
        <CardHeader title='Raw Products' />
        <Divider />
        <Typography align='center' sx={{ p: 6 }}>
          Loading...
        </Typography>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader title='Raw Products' />
        <Divider />
        <Typography align='center' color='error' sx={{ p: 6 }}>
          {error}
        </Typography>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title='Raw Products' />
      <Divider />
      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search Raw Product'
          className='max-sm:is-full'
        />
        <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='flex-auto is-[70px] max-sm:is-full'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
        </div>
      </div>
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
                  No raw products available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page) // Zero-based indexing
        }}
        onRowsPerPageChange={event => {
          table.setPageSize(Number(event.target.value)) // Update rows per page
        }}
      />
    </Card>
  )
}

export default RawProductListTable
