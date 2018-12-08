import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { ShortcutManager } from 'react-shortcuts'
import Grid from '@material-ui/core/Grid'
import AppBar from '../components/AppBar'
import MainPosts from '../components/Layout'
import ChannelMenu from '../components/ChannelMenu'
import AppSettings from '../components/AppSettings'
import ChannelSettings from '../components/ChannelSettings'
import Login from '../components/Login'
import Notification from '../components/Notification'
import MicropubEditor from '../components/MicropubEditorFull'
import ErrorBoundary from '../components/ErrorBoundary'
import GlobalShortcuts from '../components/GlobalShotcuts'
import ShortcutHelp from '../components/ShortcutHelp'
import keymap from '../modules/keymap'
import style from './style'

const shortcutManager = new ShortcutManager(keymap)

class App extends Component {
  getChildContext() {
    return { shortcuts: shortcutManager }
  }

  render() {
    let rootClasses = [this.props.classes.root]
    let channelMenuClasses = [this.props.classes.channelMenu]
    if (this.props.channelsMenuOpen) {
      rootClasses.push(this.props.classes.channelMenuOpen)
      channelMenuClasses.push(this.props.classes.channelMenuClasses)
    }

    return (
      <ErrorBoundary>
        <Router>
          <GlobalShortcuts>
            <Grid
              container
              spacing={0}
              className={this.props.classes.appWrapper}
            >
              <AppBar />
              <Grid
                item
                container
                spacing={0}
                className={rootClasses.join(' ')}
              >
                <Grid item className={channelMenuClasses.join(' ')}>
                  <ChannelMenu />
                </Grid>
                <Grid item className={this.props.classes.main}>
                  <Route exact path="/" component={MainPosts} />
                  <Route path="/channel/:channelSlug" component={MainPosts} />
                  <Route
                    path="/channel/:channelSlug/edit"
                    component={ChannelSettings}
                  />
                  <Route path="/editor" component={MicropubEditor} />
                  <Route path="/settings" component={AppSettings} />
                  <ShortcutHelp />
                </Grid>
                <Login />
                <Notification />
              </Grid>
            </Grid>
          </GlobalShortcuts>
        </Router>
      </ErrorBoundary>
    )
  }
}

App.childContextTypes = {
  shortcuts: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  channelsMenuOpen: state.app.get('channelsMenuOpen'),
})

export default connect(mapStateToProps)(withStyles(style)(App))
