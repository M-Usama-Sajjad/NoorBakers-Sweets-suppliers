'use client'

// React Imports
import { useSelector } from 'react-redux'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import UserProfile from '@views/user-profile'

// Dynamic Component Imports
const ProfileTab = dynamic(() => import('@views/user-profile/profile'))
const TeamsTab = dynamic(() => import('@views/user-profile/teams'))
const ProjectsTab = dynamic(() => import('@views/user-profile/projects'))
const ConnectionsTab = dynamic(() => import('@views/user-profile/connections'))

// Vars
const tabContentList = data => ({
  profile: <ProfileTab data={data?.profile} />,
  // teams: <TeamsTab data={data?.teams} />,
  // projects: <ProjectsTab data={data?.projects} />,
  // connections: <ConnectionsTab data={data?.connections} />
})

const ProfilePage = () => {
  // Retrieve user data from Redux store
  const user = useSelector(state => state?.auth?.user)

  // Map Redux user data to the format expected by ProfileTab
  const profileData = {
    profile: {
      about: [
        { property: 'Full Name', value: user?.name || 'N/A', icon: 'tabler-user' },
        { property: 'Status', value: user?.isActive ? 'active' : 'inactive', icon: 'tabler-check' },
        { property: 'Role', value: user?.role || 'N/A', icon: 'tabler-crown' },
        { property: 'Business Name', value: user?.businessName || 'N/A', icon: 'tabler-building-store' }
      ],
      contacts: [
        { property: 'Contact', value: user?.phone || 'N/A', icon: 'tabler-phone-call' },
        { property: 'Email', value: user?.email || 'N/A', icon: 'tabler-mail' }
      ],

    }
  }

  return <UserProfile data={profileData} tabContentList={tabContentList(profileData)} />
}

export default ProfilePage
