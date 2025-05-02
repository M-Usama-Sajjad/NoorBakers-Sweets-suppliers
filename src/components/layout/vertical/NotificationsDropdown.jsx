'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'

// Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from 'axios'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getInitials } from '@/utils/getInitials'

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <div className='overflow-x-hidden bs-full'>{children}</div>
  } else {
    return (
      <PerfectScrollbar className='bs-full' options={{ wheelPropagation: false, suppressScrollX: true }}>
        {children}
      </PerfectScrollbar>
    )
  }
}

const getAvatar = params => {
  const { avatarImage, avatarIcon, avatarText, title, avatarColor, avatarSkin } = params

  if (avatarImage) {
    return <Avatar src={avatarImage} />
  } else if (avatarIcon) {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
        <i className={avatarIcon} />
      </CustomAvatar>
    )
  } else {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
        {avatarText || getInitials(title)}
      </CustomAvatar>
    )
  }
}

const NotificationDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [notificationsState, setNotificationsState] = useState([])
  const [notificationCount, setNotificationCount] = useState(0)

  // Refs
  const anchorRef = useRef(null)
  const ref = useRef(null)

  // Hooks
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const { settings } = useSettings()

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      // Fetch notifications
      const response = await axios.get('http://localhost:5001/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: 100 // Fetch more to display in dropdown
        }
      })

      // Map API response to UI format
      const mappedNotifications = response.data.data.map(notification => ({
        id: notification._id,
        title: notification.title,
        subtitle: notification.message,
        time: new Date(notification.createdAt).toLocaleString(), // Format date
        read: notification.isRead,
        avatarImage: notification.category === 'order' ? '/images/avatars/8.png' : null, // Example: Order notifications get an avatar
        avatarIcon: notification.category === 'system' ? 'tabler-chart-bar' : null,
        avatarText: notification.category === 'product' ? 'MG' : null,
        avatarColor: notification.type === 'success' ? 'success' : 
                    notification.type === 'error' ? 'error' : 
                    notification.type === 'warning' ? 'warning' : 'info',
        avatarSkin: 'light-static',
        link: notification.link // Add link for navigation
      }))

      setNotificationsState(mappedNotifications)

      // Fetch unread count
      const unreadResponse = await axios.get('http://localhost:5001/api/notifications/unread/count', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setNotificationCount(unreadResponse.data.count)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Optional: Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
    if (!open) fetchNotifications() // Refresh notifications when opening
  }

  // Mark notification as read
  const handleReadNotification = async (event, value, index) => {
    event.stopPropagation()
    try {
      const token = localStorage.getItem('token')
      const notificationId = notificationsState[index].id

      await axios.put(`http://localhost:5001/api/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const newNotifications = [...notificationsState]
      newNotifications[index].read = true
      setNotificationsState(newNotifications)
      setNotificationCount(prev => prev - 1) // Update unread count
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Remove notification
  const handleRemoveNotification = async (event, index) => {
    event.stopPropagation()
    try {
      const token = localStorage.getItem('token')
      const notificationId = notificationsState[index].id

      await axios.delete(`http://localhost:5001/api/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const newNotifications = [...notificationsState]
      if (!newNotifications[index].read) {
        setNotificationCount(prev => prev - 1) // Update unread count if unread
      }
      newNotifications.splice(index, 1)
      setNotificationsState(newNotifications)
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Mark all notifications as read
  const readAllNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put('http://localhost:5001/api/notifications/read-all', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const newNotifications = notificationsState.map(notification => ({
        ...notification,
        read: true
      }))
      setNotificationsState(newNotifications)
      setNotificationCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Navigate to notification link (if available)
  const handleNotificationClick = (event, notification) => {
    event.stopPropagation()
    handleReadNotification(event, true, notificationsState.findIndex(n => n.id === notification.id))
    if (notification.link) {
      window.location.href = notification.link // Navigate to the link
    }
  }

  useEffect(() => {
    const adjustPopoverHeight = () => {
      if (ref.current) {
        const availableHeight = window.innerHeight - 100
        ref.current.style.height = `${Math.min(availableHeight, 550)}px`
      }
    }

    window.addEventListener('resize', adjustPopoverHeight)
  }, [])

  const readAll = notificationsState.every(notification => notification.read)

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
        <Badge
          color='error'
          className='cursor-pointer'
          variant='dot'
          overlap='circular'
          invisible={notificationCount === 0}
          sx={{
            '& .MuiBadge-dot': { top: 6, right: 5, boxShadow: 'var(--mui-palette-background-paper) 0px 0px 0px 2px' }
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <i className='tabler-bell' />
        </Badge>
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        ref={ref}
        anchorEl={anchorRef.current}
        {...(isSmallScreen
          ? {
            className: 'is-full !mbs-3 z-[1] max-bs-[550px] bs-[550px]',
            modifiers: [
              {
                name: 'preventOverflow',
                options: {
                  padding: themeConfig.layoutPadding
                }
              }
            ]
          }
          : { className: 'is-96 !mbs-3 z-[1] max-bs-[550px] bs-[550px]' })}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className={classnames('bs-full', settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg')}>
              <ClickAwayListener onClickAway={handleClose}>
                <div className='bs-full flex flex-col'>
                  <div className='flex items-center justify-between plb-3.5 pli-4 is-full gap-2'>
                    <Typography variant='h6' className='flex-auto'>
                      Notifications
                    </Typography>
                    {notificationCount > 0 && (
                      <Chip size='small' variant='tonal' color='primary' label={`${notificationCount} New`} />
                    )}
                    <Tooltip
                      title={readAll ? 'Mark all as unread' : 'Mark all as read'}
                      placement={placement === 'bottom-end' ? 'left' : 'right'}
                      slotProps={{
                        popper: {
                          sx: {
                            '& .MuiTooltip-tooltip': {
                              transformOrigin:
                                placement === 'bottom-end' ? 'right center !important' : 'right center !important'
                            }
                          }
                        }
                      }}
                    >
                      {notificationsState.length > 0 ? (
                        <IconButton size='small' onClick={() => readAllNotifications()} className='text-textPrimary'>
                          <i className={readAll ? 'tabler-mail' : 'tabler-mail-opened'} />
                        </IconButton>
                      ) : (
                        <></>
                      )}
                    </Tooltip>
                  </div>
                  <Divider />
                  <ScrollWrapper hidden={hidden}>
                    {notificationsState.map((notification, index) => {
                      const {
                        id,
                        title,
                        subtitle,
                        time,
                        read,
                        avatarImage,
                        avatarIcon,
                        avatarText,
                        avatarColor,
                        avatarSkin
                      } = notification

                      return (
                        <div
                          key={id}
                          className={classnames('flex plb-3 pli-4 gap-3 cursor-pointer hover:bg-actionHover group', {
                            'border-be': index !== notificationsState.length - 1
                          })}
                          onClick={(e) => handleNotificationClick(e, notification)}
                        >
                          {getAvatar({ avatarImage, avatarIcon, title, avatarText, avatarColor, avatarSkin })}
                          <div className='flex flex-col flex-auto'>
                            <Typography variant='body2' className='font-medium mbe-1' color='text.primary'>
                              {title}
                            </Typography>
                            <Typography variant='caption' color='text.secondary' className='mbe-2'>
                              {subtitle}
                            </Typography>
                            <Typography variant='caption' color='text.disabled'>
                              {time}
                            </Typography>
                          </div>
                          <div className='flex flex-col items-end gap-2'>
                            <Badge
                              variant='dot'
                              color={read ? 'secondary' : 'primary'}
                              onClick={e => handleReadNotification(e, !read, index)}
                              className={classnames('mbs-1 mie-1', {
                                'invisible group-hover:visible': read
                              })}
                            />
                            <i
                              className='tabler-x text-xl invisible group-hover:visible'
                              onClick={e => handleRemoveNotification(e, index)}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </ScrollWrapper>
                  <Divider />
                  <div className='p-4'>
                    <Button fullWidth variant='contained' size='small'>
                      View All Notifications
                    </Button>
                  </div>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default NotificationDropdown
