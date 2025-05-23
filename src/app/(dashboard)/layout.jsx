// MUI Imports
import Button from '@mui/material/Button'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import ScrollToTop from '@core/components/scroll-to-top'

// Util Imports
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import { getDictionary } from '@/utils/getDictionary'


const Layout = async props => {
  const { children,params } = props

  // Vars
  const direction = 'ltr'
  const mode = await getMode()
  const systemMode = await getSystemMode()
  const dictionary = await getDictionary(params.langs)


  return (
    <Providers direction={direction}>
      <LayoutWrapper
        systemMode={systemMode}
        verticalLayout={
          <VerticalLayout navigation={<Navigation mode={mode} dictionary={dictionary}  />} navbar={<Navbar />} footer={<VerticalFooter />}>
            {children}
          </VerticalLayout>
        }
      />
      <ScrollToTop className='mui-fixed'>
        <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
          <i className='tabler-arrow-up' />
        </Button>
      </ScrollToTop>
    </Providers>
  )
}

export default Layout
