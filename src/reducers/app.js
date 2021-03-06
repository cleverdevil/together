import { Map } from 'immutable'
import { getTheme, changeTitleBarTheme } from '../modules/windows-functions'

const defaultState = new Map({
  channelsMenuOpen: false,
  selectedChannel: '',
  timelineBefore: '',
  timelineAfter: '',
  notifications: [],
  focusedComponent: null,
  shortcutHelpOpen: false,
  theme: localStorage.getItem('together-theme') || getTheme() || 'light',
})

changeTitleBarTheme(defaultState.get('theme'))

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'TOGGLE_CHANNELS_MENU': {
      return state.set('channelsMenuOpen', !state.get('channelsMenuOpen'))
    }
    case 'SET_SELECTED_CHANNEL': {
      return state.set('selectedChannel', payload.uid).set('timelineAfter', '')
    }
    case 'SET_TIMELINE_BEFORE': {
      if (state.get('timelineBefore') && payload.before) {
        return state
      }
      return state.set('timelineBefore', payload.before)
    }
    case 'SET_TIMELINE_AFTER': {
      return state.set('timelineAfter', payload.after)
    }
    case 'ADD_NOTIFICATION': {
      let notifications = [...state.get('notifications')]
      notifications.push(payload.notification)
      return state.set('notifications', notifications)
    }
    case 'REMOVE_NOTIFICATION': {
      let notifications = [...state.get('notifications')]
      if (notifications.length < 2) {
        notifications = []
      } else {
        notifications.splice(payload.notificationIndex, 1)
      }
      return state.set('notifications', notifications)
    }
    case 'TOGGLE_THEME': {
      const newTheme = state.get('theme') === 'light' ? 'dark' : 'light'
      localStorage.setItem('together-theme', newTheme)
      changeTitleBarTheme(newTheme)
      return state.set('theme', newTheme)
    }
    case 'LOGOUT': {
      return defaultState
    }
    case 'SET_FOCUSED_COMPONENT': {
      return state.set('focusedComponent', payload.component)
    }
    case 'TOGGLE_SHORTCUT_HELP': {
      return state.set('shortcutHelpOpen', !state.get('shortcutHelpOpen'))
    }
    default: {
      return state
    }
  }
}
