// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AboutOverview from './AboutOverview'
import ActivityTimeline from './ActivityTimeline'
import ConnectionsTeams from './ConnectionsTeams'
import ProjectsTable from './ProjectsTables'

const ProfileTab = ({ data }) => {
  return (
  
     
        <AboutOverview data={data} />
      
     
   
  )
}

export default ProfileTab
