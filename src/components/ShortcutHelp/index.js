import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SettingsModal from '../SettingsModal'
import { toggleShortcutHelp } from '../../actions'
import keymap from '../../modules/keymap'
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

const ShortcutHelp = ({ open, toggleShortcutHelp }) => {
  return (
    <SettingsModal
      title="Keyboard Controls"
      maxWidth="lg"
      open={open}
      onClose={() => (open ? toggleShortcutHelp() : null)}
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

const mapStateToProps = state => ({
  open: state.app.get('shortcutHelpOpen'),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ toggleShortcutHelp }, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShortcutHelp)
