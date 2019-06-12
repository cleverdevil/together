import React from 'react'
import SettingsModal from '../SettingsModal'
import keymap from '../../modules/keymap'
import useLocalState from '../../hooks/use-local-state'
import ShortcutTable from './ShortcutTable'

const globalKeys = [
  {
    name: 'Focus Channels List',
    shortcuts: keymap.GLOBAL.FOCUS_CHANNEL_LIST,
  },
  {
    name: 'Show Keyboard Shorcuts',
    shortcuts: keymap.GLOBAL.HELP,
  },
  {
    name: 'Open New Post Editor',
    shortcuts: keymap.GLOBAL.NEW_POST,
  },
  {
    name: 'Load Channel',
    shortcuts: ['ctrl+1-9', 'meta+1-9', 'alt+1-9'],
  },
]

const channelListKeys = [
  {
    name: 'Next Channel',
    shortcuts: keymap.CHANNEL_LIST.NEXT,
  },
  {
    name: 'Previous Channel',
    shortcuts: keymap.CHANNEL_LIST.PREVIOUS,
  },
  {
    name: 'Load Channel',
    shortcuts: keymap.CHANNEL_LIST.SELECT_CHANNEL,
  },
]

const channelKeys = [
  {
    name: 'Next Post',
    shortcuts: keymap.TIMELINE.NEXT,
  },
  {
    name: 'Previous Post',
    shortcuts: keymap.TIMELINE.PREVIOUS,
  },
  {
    name: 'Select Post',
    shortcuts: keymap.TIMELINE.SELECT_POST,
  },
  {
    name: 'Focus Channel List',
    shortcuts: keymap.TIMELINE.FOCUS_CHANNEL_LIST,
  },
  {
    name: 'Toggle Selected Post Read',
    shortcuts: keymap.TIMELINE.MARK_READ,
  },
]

const singlePostKeys = [
  {
    name: 'Next Post',
    shortcuts: keymap.POST.NEXT,
  },
  {
    name: 'Open Post Url',
    shortcuts: keymap.POST.OPEN,
  },
  {
    name: 'Toggle Post Read',
    shortcuts: keymap.POST.TOGGLE_READ,
  },
  {
    name: 'Back to Post List',
    shortcuts: keymap.POST.TO_TIMELINE,
  },
  {
    name: 'Scroll Up',
    shortcuts: keymap.POST.SCROLL_UP,
  },
  {
    name: 'Scroll Down',
    shortcuts: keymap.POST.SCROLL_DOWN,
  },
]

const ShortcutHelp = () => {
  const [localState, setLocalState] = useLocalState()
  const open = !!localState.shortcutHelpOpen
  return (
    <SettingsModal
      title="Keyboard Controls"
      maxWidth="lg"
      open={open}
      onClose={() => setLocalState({ shortcutHelpOpen: false })}
      singleColumn
      disableAutoFocus
    >
      <ShortcutTable title="Global Controls" keys={globalKeys} />
      <ShortcutTable title="Channel List Controls" keys={channelListKeys} />
      <ShortcutTable title="Channel Controls" keys={channelKeys} />
      <ShortcutTable title="Post Controls" keys={singlePostKeys} />
    </SettingsModal>
  )
}

export default ShortcutHelp
