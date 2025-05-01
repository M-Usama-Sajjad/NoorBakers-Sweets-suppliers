'use client'

// MUI Imports
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

const Loader = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px', // Ensure it takes some vertical space
        gap: 2, // Space between loader and text
      }}
    >
      <CircularProgress size={40} color="primary" />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

export default Loader
