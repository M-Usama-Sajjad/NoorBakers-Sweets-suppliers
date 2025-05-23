// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { getProfileData } from '@/app/server/actions'
import { useSelector } from 'react-redux'
import Image from 'next/image'

const UserProfileHeader = ({data}) => {
  const user = useSelector(state => state?.auth?.user)

  return (
    <Card>
      <CardMedia image={user?.coverImg} className='bs-[250px]' />
      <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
        <div className='flex rounded-bs-md mbs-[-40px] border-[5px] mis-[-5px] border-be-0  border-backgroundPaper bg-backgroundPaper'>
          {
            user?.profilepic ? (
              <Image
                src={user?.profilepic}
                alt={user?.name || 'User'}
                width={120}
                height={120}
                className='rounded'
              />
            ) : (
              <div className='flex items-center justify-center rounded-full w-[120px] h-[120px] bg-backgroundPaper'>
                <i className='tabler-user text-4xl' />
              </div>
            )
          }
          {/* <Image height={120} width={120} src={user?.profilepic } className='rounded' alt='Profile Background' /> */}
        </div>
        <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Typography variant='h4'>{user?.name}</Typography>
            <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
              <div className='flex items-center gap-2'>
                {data?.designationIcon && <i className={data?.designationIcon} />}
                <Typography className='font-medium'>{user?.role}</Typography>
              </div>
              <div className='flex items-center gap-2'>
                <i className='tabler-map-pin' />
                <Typography className='font-medium'>{user?.address}</Typography>
              </div>
              <div className='flex items-center gap-2'>
                <i className='tabler-calendar' />
                <Typography className="font-medium">
  {new Date(user?.createdAt).toLocaleDateString(undefined, {
    year:  'numeric',
    month: 'long',   // "April"; use 'short' for "Apr" or '2-digit' for "04"
    day:   'numeric' // "20"
  })}
</Typography>              </div>
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  )
}

export default UserProfileHeader
