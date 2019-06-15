import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import useLocalState from '../../hooks/use-local-state'
import theme from './style'

const Theme = ({ children }) => {
  const [localState] = useLocalState()
  const muiTheme = theme(localState.theme)

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
export default Theme
