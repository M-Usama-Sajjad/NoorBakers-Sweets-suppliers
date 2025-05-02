// ProductImage.jsx
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import axios from '@/utils/axios'

// Component Imports
import Link from '@components/Link'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

// Styled Dropzone Component
const Dropzone = styled(AppReactDropzone)(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

const ProductImage = ({ onImageUpload }) => {
  // States
  const [files, setFiles] = useState([])
  const [imgSrc, setImgSrc] = useState(null)
  const [profilePicUrl, setProfilePicUrl] = useState(null)

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
      handleFileUpload(acceptedFiles[0])
    }
  })

  const handleFileUpload = async (file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setImgSrc(reader.result)
    reader.readAsDataURL(file)

    // Upload image to API
    try {
      const formData = new FormData()
      formData.append('image', file)
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:5001/api/upload/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.fileName) {
        const imageUrl = process.env.NEXT_PUBLIC_FILE_PATH + response.data.fileName
        setProfilePicUrl(imageUrl)
        onImageUpload(imageUrl) // Pass the uploaded image URL to parent
      } else {
        console.error('Image upload failed:', response.data.message)
      }
    } catch (error) {
      console.error('Error uploading image:', error.response?.data?.message || error.message)
    }
  }

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={imgSrc || URL.createObjectURL(file)} />
    } else {
      return <i className='tabler-file-description' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
    setImgSrc(null)
    setProfilePicUrl(null)
    onImageUpload(null) // Reset image URL in parent
  }

  const handleRemoveAllFiles = () => {
    setFiles([])
    setImgSrc(null)
    setProfilePicUrl(null)
    onImageUpload(null) // Reset image URL in parent
  }

  const fileList = files.map(file => (
    <ListItem key={file.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name font-medium' color='text.primary'>
            {file.name}
          </Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='tabler-x text-xl' />
      </IconButton>
    </ListItem>
  ))

  return (
    <Dropzone>
      <Card>
        <CardHeader
          title='Product Image'
          action={
            <Typography component={Link} color='primary.main' className='font-medium'>
              Add media from URL
            </Typography>
          }
          sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }}
        />
        <CardContent>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='flex items-center flex-col gap-2 text-center'>
              <CustomAvatar variant='rounded' skin='light' color='secondary'>
                <i className='tabler-upload' />
              </CustomAvatar>
              <Typography variant='h4'>Drag and Drop Your Image Here.</Typography>
              <Typography color='text.disabled'>or</Typography>
              <Button variant='tonal' size='small'>
                Browse Image
              </Button>
            </div>
          </div>
          {files.length ? (
            <>
              <List>{fileList}</List>
              <div className='buttons'>
                <Button color='error' variant='tonal' onClick={handleRemoveAllFiles}>
                  Remove All
                </Button>
                <Button variant='contained'>Upload Files</Button>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </Dropzone>
  )
}

export default ProductImage
