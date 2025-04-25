'use client'

// React Imports
import React, { useState, useMemo, useCallback, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

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
import axios from 'axios'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import OptionMenu from '@core/components/option-menu'
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
  const [open, setOpen] = useState(false) // For add task dialog
  const [name, setName] = useState('')
  const [detail, setDetail] = useState('')
  const [correctiveActionsOpen, setCorrectiveActionsOpen] = useState(false) // For corrective actions dialog
  const [correctiveActions, setCorrectiveActions] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  const { lang: locale } = useParams()

  // Fetch tasks from API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token') // Retrieve token from localStorage
        const response = await axios.get('http://localhost:5001/api/tasks/', {
          headers: {
            Authorization: `Bearer ${token}` // Include token in Authorization header
          }
        })
        // Map API response to match frontend schema
        console.log(response.data.data, 'hiiiiii')
        const mappedTasks = response.data.data.map(task => ({
          id: task._id,
          name: task.title,
          detail: task.description,
          createdAt: new Date(task.createdAt),
          markdone: task.status === 'completed' || task.status === 'verified',
          type: task.type // Include task type to identify HACCP tasks
        }))
        setTasks(mappedTasks)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
    fetchTasks()
  }, [])

  const calculateTimeLeft = (taskDate) => {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const diffMs = midnight - now
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffHrs}h ${diffMins}m`
  }

  const handleToggleMarkDone = useCallback(async (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task.type === 'haccp' && !task.markdone) {
      // Open dialog for corrective actions if task is HACCP and being marked as done
      setSelectedTaskId(taskId)
      setCorrectiveActionsOpen(true)
    } else {
      // Proceed with status update for non-HACCP tasks or when unmarking
      try {
        const newStatus = task.markdone ? 'pending' : 'completed'
        const token = localStorage.getItem('token')
        await axios.patch(
          `http://localhost:5001/api/tasks/${taskId}/status`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setTasks(prev =>
          prev.map(t =>
            t.id === taskId ? { ...t, markdone: !t.markdone } : t
          )
        )
      } catch (error) {
        console.error('Error updating task status:', error)
      }
    }
  }, [tasks])

  const handleCorrectiveActionsSubmit = useCallback(async () => {
    if (!correctiveActions.trim()) {
      alert('Please provide corrective actions.')
      return
    }
    try {
      const token = localStorage.getItem('token')
      await axios.patch(
        `http://localhost:5001/api/tasks/${selectedTaskId}/status`,
        { status: 'completed', correctiveActions },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setTasks(prev =>
        prev.map(task =>
          task.id === selectedTaskId ? { ...task, markdone: true } : task
        )
      )
      setCorrectiveActionsOpen(false)
      setCorrectiveActions('')
      setSelectedTaskId(null)
    } catch (error) {
      console.error('Error updating task status:', error)
      alert(error.response?.data?.message || 'Failed to update task status')
    }
  }, [correctiveActions, selectedTaskId])

  const handleCorrectiveActionsClose = () => {
    setCorrectiveActionsOpen(false)
    setCorrectiveActions('')
    setSelectedTaskId(null)
  }

  const handleDeleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setName('')
    setDetail('')
  }

  const handleSubmit = () => {
    if (!name.trim() || !detail.trim()) {
      alert('Please fill in both fields.')
      return
    }

    const newTask = {
      id: Date.now(),
      name: name.trim(),
      detail: detail.trim(),
      createdAt: new Date(),
      markdone: false
    }

    setTasks(prev => [...prev, newTask])
    handleClose()
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
        cell: ({ row }) => (
          <Typography>{calculateTimeLeft(row.original.createdAt)}</Typography>
        )
      }),
      columnHelper.accessor('markdone', {
        header: 'Mark Done',
        cell: ({ row }) => (
          <Switch
            checked={row.original.markdone}
            onChange={() => handleToggleMarkDone(row.original.id)}
          />
        ),
        enableSorting: false
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Typography>{row.original.markdone ? 'Done' : 'Pending'}</Typography>
        )
      }),
      columnHelper.accessor('timeleft', {
        header: 'Priority',
        cell: ({ row }) => (
          <Typography>{calculateTimeLeft(row.original.createdAt)}</Typography>
        )
      })
    ],
    [handleToggleMarkDone, handleDeleteTask]
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

      {/* Add Task Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle>
          <Typography variant='h6'>Add New Task</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Task Name'
            fullWidth
            variant='outlined'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g., RoomTemperature'
          />
          <TextField
            margin='dense'
            label='Task Detail'
            fullWidth
            variant='outlined'
            multiline
            rows={4}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder='e.g., Monitor room temperature every hour...'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant='contained' color='primary'>
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Corrective Actions Dialog for HACCP Tasks */}
      <Dialog open={correctiveActionsOpen} onClose={handleCorrectiveActionsClose} maxWidth='sm' fullWidth>
        <DialogTitle>
          <Typography variant='h6'>Provide Corrective Actions</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Corrective Actions'
            fullWidth
            variant='outlined'
            multiline
            rows={4}
            value={correctiveActions}
            onChange={(e) => setCorrectiveActions(e.target.value)}
            placeholder='e.g., Adjust thermostat if temperature exceeds 5°C'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCorrectiveActionsClose} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleCorrectiveActionsSubmit} variant='contained' color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default TaskListTable
