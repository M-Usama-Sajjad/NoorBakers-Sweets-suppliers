'use client';

// React Imports
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// MUI Imports
import {
  IconButton, Badge, Popper, Fade, Paper, ClickAwayListener,
  Typography, Chip, Tooltip, Divider, Avatar, Button
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

// Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from '@/utils/axios'

// Custom Components & Hooks
import CustomAvatar from '@core/components/mui/Avatar';
import themeConfig from '@configs/themeConfig';
import { useSettings } from '@core/hooks/useSettings';
import { getInitials } from '@/utils/getInitials';

const ScrollWrapper = ({ children, hidden }) => {
  return hidden
    ? <div className='overflow-x-hidden bs-full'>{children}</div>
    : <PerfectScrollbar className='bs-full' options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>;
};

const getAvatar = ({ avatarImage, avatarIcon, avatarText, title, avatarColor, avatarSkin }) => {
  if (avatarImage) return <Avatar src={avatarImage} />;
  if (avatarIcon) return (
    <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
      <i className={avatarIcon} />
    </CustomAvatar>
  );
  return (
    <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
      {avatarText || getInitials(title)}
    </CustomAvatar>
  );
};

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const anchorRef = useRef(null);
  const popperRef = useRef(null);

  // Hooks
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const { settings } = useSettings()

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/notifications')
      setNotificationsState(response.data.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [notifRes, unreadRes] = await Promise.all([
          axios.get('http://localhost:5001/api/notifications', {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit: 100 }
          }),
          axios.get('http://localhost:5001/api/notifications/unread/count', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        console.log('Notification data:', notifRes.data.data);
        const mapped = notifRes.data.data.map(n => ({
          id: n._id,
          title: n.title,
          subtitle: n.message,
          time: new Date(n.createdAt).toLocaleString(),
          read: n.isRead,
          avatarImage: n.category === 'order' ? '/images/avatars/8.png' : null,
          avatarIcon: n.category === 'system' ? 'tabler-chart-bar' : null,
          avatarText: n.category === 'product' ? 'MG' : null,
          avatarColor: n.type === 'success' ? 'success' :
            n.type === 'error' ? 'error' :
              n.type === 'warning' ? 'warning' : 'info',
          avatarSkin: 'light-static',
          link: n.data.orderId
        }));

        if (isMounted) {
          setNotifications(mapped);
          setUnreadCount(unreadRes.data.count);
        }
      } catch (err) {
        console.error('Notification fetch error:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const adjustHeight = () => {
      if (popperRef.current) {
        const max = Math.min(window.innerHeight - 100, 550);
        popperRef.current.style.height = `${max}px`;
      }
    };
    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, []);

  const handleToggle = () => {
    setOpen(prev => !prev);
  };

  const handleClose = () => setOpen(false);

  const markAsRead = async (e, index) => {
    e.stopPropagation();
    try {
      const notificationId = notificationsState[index].id

      await axios.put(`/notifications/${notificationId}/read`)

      const updated = [...notifications];
      updated[index].read = true;
      setNotifications(updated);
      setUnreadCount(c => c - 1);
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const removeNotification = async (e, index) => {
    e.stopPropagation();
    try {
      const notificationId = notificationsState[index].id

      await axios.delete(`/notifications/${notificationId}`)

      const updated = [...notifications];
      if (!read) setUnreadCount(c => c - 1);
      updated.splice(index, 1);
      setNotifications(updated);
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put('/notifications/read-all')

      const updated = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updated);
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };
  const router = useRouter();

  const handleNotificationClick = (e, notification, index) => {
    markAsRead(e, index);
    router.push("http://localhost:3000/orders/details/" + notification.link);
  };

  const allRead = notifications.every(n => n.read);

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleToggle}
        className='text-textPrimary'
        aria-label="Open notifications"
      >
        <Badge
          color='error'
          variant='dot'
          overlap='circular'
          invisible={unreadCount === 0}
          sx={{
            '& .MuiBadge-dot': {
              top: 6,
              right: 5,
              boxShadow: 'var(--mui-palette-background-paper) 0px 0px 0px 2px'
            }
          }}
        >
          <i className='tabler-bell' />
        </Badge>
      </IconButton>

      <Popper
        open={open}
        transition
        disablePortal
        ref={popperRef}
        anchorEl={anchorRef.current}
        placement='bottom-end'
        className={classnames(
          isSmallScreen ? 'is-full !mbs-3 z-[1] max-bs-[550px] bs-[550px]' : 'is-96 !mbs-3 z-[1] max-bs-[550px] bs-[550px]'
        )}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className={classnames('bs-full', settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg')}>
              <ClickAwayListener onClickAway={handleClose}>
                <div className='bs-full flex flex-col'>
                  <div className='flex items-center justify-between plb-3.5 pli-4 gap-2'>
                    <Typography variant='h6' className='flex-auto'>Notifications</Typography>
                    {unreadCount > 0 && (
                      <Chip size='small' variant='tonal' color='primary' label={`${unreadCount} New`} />
                    )}
                    {notifications.length > 0 && (
                      <Tooltip title={allRead ? 'Mark all as unread' : 'Mark all as read'} placement='left'>
                        <IconButton size='small' onClick={markAllRead} className='text-textPrimary'>
                          <i className={allRead ? 'tabler-mail' : 'tabler-mail-opened'} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>

                  <Divider />

                  <ScrollWrapper hidden={hidden}>
                    {notifications.map((n, i) => (
                      <div
                        key={n.id}
                        className={classnames('flex plb-3 pli-4 gap-3 cursor-pointer hover:bg-actionHover group', {
                          'border-be': i !== notifications.length - 1
                        })}
                        onClick={e => handleNotificationClick(e, n, i)}
                      >
                        {getAvatar(n)}
                        <div className='flex flex-col flex-auto'>
                          <Typography variant='body2' className='font-medium mbe-1'>{n.title}</Typography>
                          <Typography variant='caption' color='text.secondary' className='mbe-2'>{n.subtitle}</Typography>
                          <Typography variant='caption' color='text.disabled'>{n.time}</Typography>
                        </div>
                        <div className='flex flex-col items-end gap-2'>
                          <Badge
                            variant='dot'
                            color={n.read ? 'secondary' : 'primary'}
                            onClick={e => markAsRead(e, i)}
                            className={classnames('mbs-1 mie-1', {
                              'invisible group-hover:visible': n.read
                            })}
                          />
                          <i className='tabler-x text-xl invisible group-hover:visible' onClick={e => removeNotification(e, i)} />
                        </div>
                      </div>
                    ))}
                  </ScrollWrapper>

                  <Divider />

                  <div className='p-4'>
                    <Button fullWidth variant='contained' size='small'>View All Notifications</Button>
                  </div>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default NotificationDropdown;
