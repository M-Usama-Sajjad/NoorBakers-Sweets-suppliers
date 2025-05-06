'use client'

// React Imports
import React, { useState, useMemo, useCallback, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
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
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Axios Import
import axios from '@/utils/axios'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  React.useEffect(() => setValue(initialValue), [initialValue])
  React.useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(timeout)
  }, [value, onChange, debounce])
  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper()

const TaskListTable = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [tasks, setTasks] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const { lang: locale } = useParams()

  // Fetch tasks from API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/tasks/')
        // Map API response to match frontend schema
        console.log(response.data.data, 'hiiiiii')
        const mappedTasks = response.data.data.map(task => ({
          id: task._id,
          name: task.title,
          detail: task.description,
          createdAt: new Date(task.createdAt),
          markdone: task.status === 'completed' || task.status === 'verified',
          type: task.type,
          priority: task.priority
        }))
        setTasks(mappedTasks)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
    fetchTasks()
  }, [])

  const calculateTimeLeft = taskDate => {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const diffMs = midnight - now
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffHrs}h ${diffMins}m`
  }

  const handleToggleMarkDone = useCallback(
    async taskId => {
      const task = tasks.find(t => t.id === taskId)
      try {
        const newStatus = task.markdone ? 'pending' : 'completed'
        await axios.patch(`/tasks/${taskId}/status`, { status: newStatus })
        setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, markdone: !t.markdone } : t)))
        setSuccess(true)
        setMessage(`Task marked as ${newStatus}`)
        setSnackbarOpen(true)
      } catch (error) {
        console.error('Error updating task status:', error)
        setSuccess(false)
        setMessage('Failed to update task status')
        setSnackbarOpen(true)
      }
    },
    [tasks]
  )

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
    setMessage('')
  }

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        )
      },
      columnHelper.accessor('name', {
        header: 'Title',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.name}
          </Typography>
        )
      }),
      columnHelper.accessor('detail', {
        header: 'Detail',
        cell: ({ row }) => (
          <Typography
            variant='body2'
            className='max-h-[100px] overflow-y-auto'
            style={{ maxWidth: '200px', whiteSpace: 'pre-wrap' }}
          >
            {row.original.detail}
          </Typography>
        )
      }),
      columnHelper.accessor('timeleft', {
        header: 'Time Left',
        cell: ({ row }) => <Typography>{calculateTimeLeft(row.original.createdAt)}</Typography>
      }),
      columnHelper.accessor('markdone', {
        header: 'Mark Done',
        cell: ({ row }) => (
          <Switch checked={row.original.markdone} onChange={() => handleToggleMarkDone(row.original.id)} />
        ),
        enableSorting: false
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => <Typography>{row.original.markdone ? 'Done' : 'Pending'}</Typography>
      }),
      columnHelper.accessor('priority', {
        header: 'Priority',
        cell: ({ row }) => <Typography>{row.original.priority || 'N/A'}</Typography>
      })
    ],
    [handleToggleMarkDone]
  )

  const table = useReactTable({
    data: tasks,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <>
      <Card>
        <div className='flex flex-wrap justify-between gap-4 p-6'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Task'
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
        <Divider />
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
              <tbody>
                {table.getRowModel().rows.map(row => (
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
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default TaskListTable
