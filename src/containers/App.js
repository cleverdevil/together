import React from 'react'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { ShortcutManager } from 'react-shortcuts'
import Meta from '../components/Meta'
import Grid from '@material-ui/core/Grid'
import { SnackbarProvider } from 'notistack'
import useLocalState from '../hooks/use-local-state'
import AppBar from '../components/AppBar'
import MainPosts from '../components/Layout'
import ChannelMenu from '../components/ChannelMenu'
import AppSettings from '../components/AppSettings'
import ChannelSettings from '../components/ChannelSettings'
import Login from '../components/Login'
import Auth from '../components/Auth'
import MicropubEditor from '../components/MicropubEditorFull'
import ErrorBoundary from '../components/ErrorBoundary'
import GlobalShortcuts from '../components/GlobalShotcuts'
import ShortcutHelp from '../components/ShortcutHelp'
import TestMe from '../components/TestMe'
import keymap from '../modules/keymap'
import style from './style'

const shortcutManager = new ShortcutManager(keymap)

const AuthedRoute = ({ component: Component, ...routeProps }) => {
  const [localState] = useLocalState()

  return (
    <Route
      {...routeProps}
      render={props =>
        localState && localState.token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}

const App = ({ classes }) => {
  // getChildContext() {
  //   return { shortcuts: shortcutManager }
  // }
  const [localState] = useLocalState()

  return (
    <ErrorBoundary>
      <SnackbarProvider
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Router>
          {/* <GlobalShortcuts> */}
          <Grid container spacing={0} className={classes.appWrapper}>
            <Meta />
            <Switch>
              <Route path="/channel/:channelSlug" component={AppBar} />
              <Route path="/" component={AppBar} />
            </Switch>
            <Grid
              item
              container
              spacing={0}
              className={
                localState.channelsMenuOpen
                  ? classes.root + ' ' + classes.channelMenuOpen
                  : classes.root
              }
            >
              <Grid
                item
                className={
                  localState.channelsMenuOpen
                    ? classes.channelMenu + ' ' + classes.channelMenuClasses
                    : classes.channelMenu
                }
              >
                <Switch>
                  <Route path="/channel/:channelSlug" component={ChannelMenu} />
                  <Route path="/" component={ChannelMenu} />
                </Switch>
              </Grid>
              <Grid item className={classes.main}>
                <AuthedRoute exact path="/" component={MainPosts} />
                <AuthedRoute
                  path="/channel/:channelSlug"
                  component={MainPosts}
                />
                <AuthedRoute path="/me/:postType" component={TestMe} />
                <AuthedRoute path="/me" component={TestMe} />
                <AuthedRoute
                  path="/channel/:channelSlug/edit"
                  component={ChannelSettings}
                />
                <AuthedRoute path="/editor" component={MicropubEditor} />
                <AuthedRoute path="/settings" component={AppSettings} />
                {/* <ShortcutHelp /> */}
              </Grid>
              <Route path="/login" component={Login} />
              <Route path="/auth" component={Auth} />
            </Grid>
          </Grid>
          {/* </GlobalShortcuts> */}
        </Router>
      </SnackbarProvider>
    </ErrorBoundary>
  )
}

App.childContextTypes = {
  shortcuts: PropTypes.object.isRequired,
}

export default withStyles(style)(App)
