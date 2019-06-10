import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Shortcuts } from 'react-shortcuts'
import channelQuery from '../../queries/channels'

class GlobalShortcutHandler extends Component {
  constructor(props) {
    super(props)
    this.handleShortcuts = this.handleShortcuts.bind(this)
  }

  handleShortcuts(action) {
    const {
      data,
      selectChannel,
      history,
      focusComponent,
      toggleShortcutHelp,
    } = this.props

    const { channels } = data

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

export default withRouter(channelQuery(GlobalShortcutHandler))
