import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
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
import style from './style'

class App extends Component {
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
          <Grid container spacing={0} className={this.props.classes.appWrapper}>
            <AppBar />
            <Grid item container spacing={0} className={rootClasses.join(' ')}>
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
                <Route exact path="/editor" component={MicropubEditor} />
                <Route exact path="/settings" component={AppSettings} />
              </Grid>
              <Login />
              <Notification />
            </Grid>
          </Grid>
        </Router>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => ({
  channelsMenuOpen: state.app.get('channelsMenuOpen'),
})

export default connect(mapStateToProps)(withStyles(style)(App))
