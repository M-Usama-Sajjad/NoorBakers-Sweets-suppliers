'use client'

// React Imports
import { useRef, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import { getInitials } from '@/utils/getInitials'
import axios from '@/utils/axios'
import CircularProgress from '@mui/material/CircularProgress'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

// Styled component to replace MenuItem
const MenuItemReplacement = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 4),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  // Ensure compatibility with mli-2 gap-3 classes
  marginLeft: theme.spacing(2),
  gap: theme.spacing(1.5)
}))

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  // Refs
  const anchorRef = useRef(null)

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event, url) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    setLoading(true)
    try {
      await axios.get('/auth/logout')
      localStorage.removeItem('token')
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const user = useSelector(state => state?.auth?.user)
  const state = useSelector(state => state)
  console.log(user)
  console.log(state)

  const getAvatarContent = () => {
    if (user?.profilepic) {
      return (
        <Image
          width={38}
          height={38}
          src={user.profilepic}
          ref={anchorRef}
          alt={user?.name || 'User'}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px] rounded-full'
        />
      )
    } else {
      return (
        <Avatar
          ref={anchorRef}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
          sx={{ bgcolor: 'primary.main' }}
        >
          {getInitials(user?.name || 'User')}
        </Avatar>
      )
    }
  }

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        {getAvatarContent()}
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    {user?.profilepic ? (
                      <Image
                        src={user.profilepic}
                        alt={user?.name || 'User'}
                        width={38}
                        height={38}
                        className='rounded-full'
                      />
                    ) : (
                      <Avatar sx={{ bgcolor: 'primary.main' }} className='bs-[38px] is-[38px]'>
                        {getInitials(user?.name || 'User')}
                      </Avatar>
                    )}
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {user?.name}
                      </Typography>
                      <Typography variant='caption'>{user?.email}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItemReplacement
                    className='mli-2 gap-3'
                    onClick={e => {
                      e.stopPropagation()
                      console.log('sent to profile')
                      handleDropdownClose(e, '/user-profile')
                    }}
                  >
                    <i className='tabler-user' />
                    <Typography color='text.primary'>My Profile</Typography>
                  </MenuItemReplacement>
                  <MenuItemReplacement
                    className='mli-2 gap-3'
                    onClick={e => {
                      e.stopPropagation()
                      console.log('sent to settings')
                      handleDropdownClose(e, '/account-settings')
                    }}
                  >
                    <i className='tabler-settings' />
                    <Typography color='text.primary'>Settings</Typography>
                  </MenuItemReplacement>
                  {/* <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='tabler-currency-dollar' />
                    <Typography color='text.primary'>Pricing</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='tabler-help-circle' />
                    <Typography color='text.primary'>FAQ</Typography>
                  </MenuItem> */}
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      disabled={loading}
                      endIcon={loading && <i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Logout'}
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
