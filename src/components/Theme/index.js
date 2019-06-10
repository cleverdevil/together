import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import useLocalState from '../../hooks/use-local-state'
import theme from './style'

const Theme = ({ children }) => {
  const [localState] = useLocalState()
  const muiTheme = theme(localState.theme)

  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
}
export default Theme
