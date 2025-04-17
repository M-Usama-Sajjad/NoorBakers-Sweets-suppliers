// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import AuthCheck from '@components/auth/AuthCheck'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

const Layout = async props => {
  const { children } = props
  const direction = 'ltr'
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <AuthCheck />
      <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
    </Providers>
  )
}

export default Layout
