import React from 'react'
import { Shortcuts } from 'react-shortcuts'
import useReactRouter from 'use-react-router'
import useLocalState from '../../hooks/use-local-state'
import useChannels from '../../hooks/use-channels'

const GlobalShortcutHandler = ({ children, className }) => {
  const { history } = useReactRouter()
  const { channels } = useChannels()
  const [localState, setLocalState] = useLocalState()

  const handleShortcuts = action => {
    if (action.startsWith('CHANNEL_')) {
      // Switch channel
      const channelIndex = parseInt(action.replace('CHANNEL_', '')) - 1
      if (channels && channels[channelIndex] && channels[channelIndex].uid) {
        // Switch to the selected channel
        const uid = channels[channelIndex].uid
        history.push(`/channel/${uid}`)
        setLocalState({ focusedComponent: 'timeline' })
      }
    } else {
      // Other actions
      switch (action) {
        case 'NEW_POST':
          history.push('/editor')
          break
        case 'FOCUS_CHANNEL_LIST':
          setLocalState({ focusedComponent: 'channels' })
          break
        case 'HELP':
          setLocalState({ shortcutHelpOpen: !!!localState.shortcutHelpOpen })
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

  return (
    <Shortcuts
      className={className}
      name="GLOBAL"
      handler={handleShortcuts}
      global
    >
      {children}
    </Shortcuts>
  )
}

export default GlobalShortcutHandler
