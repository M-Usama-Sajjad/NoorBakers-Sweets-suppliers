'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'

// Third-party Imports
import axios from 'axios'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import Image from 'next/image'

// Vars
const languageData = ['English', 'Arabic', 'French', 'German', 'Portuguese']

const AccountDetails = () => {
  // States
  const [formData, setFormData] = useState(null)
  const [fileInput, setFileInput] = useState('')
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [language, setLanguage] = useState(['English'])
  const [profilePicUrl, setProfilePicUrl] = useState(null)

  // Redux: Get user data from store
  const user = useSelector(state => state.auth.user)

  // Initialize formData with Redux user data
  useEffect(() => {
    if (user) {
      const [city, state, country] = user.address ? user.address.split(', ').map(s => s.trim()) : ['', '', '']
      setFormData({
        firstName: user.name ? user.name.split(' ')[0] : '',
        lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
        email: user.email || '',
        organization: user.businessName || '',
        phoneNumber: user.phone || '',
        address: city || '',
        state: state || '',
        zipCode: '',
        country: country ? country.toLowerCase() : 'usa',
        language: 'english',
        timezone: 'gmt-05',
        currency: 'usd'
      })
      // Set initial profile picture if available
      setImgSrc(user.profilepic || '/images/avatars/1.png')
    }
  }, [user])

  const handleDelete = value => {
    setLanguage(current => current.filter(item => item !== value))
  }

  const handleChange = event => {
    setLanguage(event.target.value)
  }

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleFileInputChange = async file => {
    const reader = new FileReader()
    const { files } = file.target

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setFileInput(reader.result)
      }

      // Upload image to API
      try {
        const formData = new FormData()
        formData.append('image', files[0])
        const token = localStorage.getItem('token')
        const response = await axios.post('http://localhost:5001/api/upload/upload', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response.data.fileName) {
          setProfilePicUrl(process.env.NEXT_PUBLIC_FILE_PATH + response.data.fileName)
        } else {
          console.error('Image upload failed:', response.data.message)
        }
      } catch (error) {
        console.error('Error uploading image:', error.response?.data?.message || error.message)
      }
    }
  }

  const handleFileInputReset = () => {
    setFileInput('')
    setImgSrc(user?.profilepic || '/images/avatars/1.png')
    setProfilePicUrl(null)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!user || !formData) return

    try {
      const token = localStorage.getItem('token')
      const updatedData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        businessName: formData.organization,
        phone: formData.phoneNumber,
        address: `${formData.address}, ${formData.state}, ${formData.country}`,
        profilepic: profilePicUrl || user.profilepic || null
      }

      const response = await axios.patch(`http://localhost:5001/api/users/${user._id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        console.log('User updated successfully:', response.data)
        // Optionally dispatch an action to update Redux store with new user data
      } else {
        console.error('User update failed:', response.data.message)
      }
    } catch (error) {
      console.error('Error updating user:', error.response?.data?.message || error.message)
    }
  }

  if (!formData) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Card>
      <CardContent className='mbe-4'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <Image height={100} width={100} className='rounded' src={imgSrc || null} alt='Profile' key={imgSrc} />
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button component='label' variant='contained' htmlFor='account-settings-upload-image'>
                Upload New Photo
                <input
                  hidden
                  type='file'
                  value={fileInput}
                  accept='image/png, image/jpeg'
                  onChange={handleFileInputChange}
                  id='account-settings-upload-image'
                />
              </Button>
              <Button variant='tonal' color='secondary' onClick={handleFileInputReset}>
                Reset
              </Button>
            </div>
            <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='First Name'
                value={formData.firstName}
                placeholder='John'
                onChange={e => handleFormChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Last Name'
                value={formData.lastName}
                placeholder='Doe'
                onChange={e => handleFormChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Email'
                value={formData.email}
                placeholder='john.doe@gmail.com'
                onChange={e => handleFormChange('email', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Bussiness Name'
                value={formData.organization}
                placeholder='Pixinvent'
                onChange={e => handleFormChange('organization', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Phone Number'
                value={formData.phoneNumber}
                placeholder='+1 (234) 567-8901'
                onChange={e => handleFormChange('phoneNumber', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Address'
                value={formData.address}
                placeholder='Address'
                onChange={e => handleFormChange('address', e.target.value)}
              />
            </Grid>
           
            
           
            
            <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
              <Button
                variant='tonal'
                type='reset'
                color='secondary'
                onClick={() => {
                  setFormData({
                    firstName: user?.name ? user.name.split(' ')[0] : '',
                    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : '',
                    email: user?.email || '',
                    organization: user?.businessName || '',
                    phoneNumber: user?.phone || '',
                    address: user?.address ? user.address.split(', ')[0] : '',
                    state: user?.address ? user.address.split(', ')[1] : '',
                    zipCode: '',
                    country: user?.address ? user.address.split(', ')[2]?.toLowerCase() : 'usa',
                    language: 'english',
                    timezone: 'gmt-05',
                    currency: 'usd'
                  })
                  setLanguage(['English'])
                  handleFileInputReset()
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
