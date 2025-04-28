'use client'

import { Provider } from 'react-redux'
import store from '@/libs/redux/index' // Adjust the path to your store file

const ReduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}

export default ReduxProvider
