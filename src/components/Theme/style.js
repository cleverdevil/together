import { createMuiTheme } from '@material-ui/core/styles'
// import secondary from '@material-ui/core/colors/indigo'
// import primary from '@material-ui/core/colors/blue'

export default type => {
  const dark = type === 'dark' ? true : false
  return createMuiTheme({
    typography: {
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
      fontWeightLight: 400,
      fontWeightRegular: 400,
      fontWeightMedium: 900,
    },
    palette: {
      type,
      primary: { main: '#104ebf' },
      secondary: { main: '#1c1f24' },
      // primary: {
      //   light: dark ? '#222' : '#5e92f3',
      //   main: dark ? '#111' : '#1565c0',
      //   dark: dark ? '#000000' : '#003c8f',
      //   contrastText: dark ? '#fff' : '#fff',
      // },
      // secondary: {
      //   light: dark ? '#5e92f3' : '#5472d3',
      //   main: dark ? '#1565c0' : '#0d47a1',
      //   dark: dark ? '#003c8f' : '#002171',
      //   contrastText: dark ? '#fff' : '#fff',
      // },
      background: {
        paper: dark ? '#222' : '#fff',
        default: dark ? '#111' : '#fafafa',
      },
    },
  })
}
