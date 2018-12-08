import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { Shortcuts } from 'react-shortcuts'
import {
  selectChannel,
  toggleChannelsMenu,
  focusComponent,
  toggleShortcutHelp,
} from '../../actions'

class GlobalShortcutHandler extends Component {
  constructor(props) {
    super(props)
    this.handleShortcuts = this.handleShortcuts.bind(this)
  }

  handleShortcuts(action) {
    const {
      channels,
      selectChannel,
      history,
      focusComponent,
      toggleShortcutHelp,
    } = this.props

    if (action.indexOf('CHANNEL_') === 0) {
      // Switch channel
      const channelIndex = parseInt(action.replace('CHANNEL_', '')) - 1
      if (channels && channels[channelIndex] && channels[channelIndex].uid) {
        // Switch to the selected channel
        const uid = channels[channelIndex].uid
        history.push(`/channel/${uid}`)
        selectChannel(uid)
        focusComponent(null)
        focusComponent('timeline')
      }
    } else {
      // Other actions
      switch (action) {
        case 'NEW_POST':
          history.push('/editor')
          break
        case 'FOCUS_CHANNEL_LIST':
          focusComponent(null)
          focusComponent('channels')
          break
        case 'HELP':
          toggleShortcutHelp()
          break
        case 'KONAMI':
          alert('Look at you. You are very clever')
          break
        default:
          // Nothing to do
          break
      }
    }
  }

  render() {
    return (
      <Shortcuts name="GLOBAL" handler={this.handleShortcuts} global>
        {this.props.children}
      </Shortcuts>
    )
  }
}

const mapStateToProps = state => ({
  channels: state.channels
    .toJS()
    .filter(channel => channel.uid !== 'notifications'),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { selectChannel, toggleChannelsMenu, focusComponent, toggleShortcutHelp },
    dispatch
  )

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GlobalShortcutHandler)
)
