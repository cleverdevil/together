import { Map } from 'immutable';

const defaultState = new Map({
  channelsMenuOpen: false,
  selectedChannel: '',
  timelineBefore: '',
  timelineAfter: '',
  notifications: [],
  theme: localStorage.getItem('together-theme') || 'light',
});

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'TOGGLE_CHANNELS_MENU': {
      return state.set('channelsMenuOpen', !state.get('channelsMenuOpen'));
    }
    case 'SET_SELECTED_CHANNEL': {
      return state.set('selectedChannel', payload.uid);
    }
    case 'SET_TIMELINE_BEFORE': {
      return state.set('timelineBefore', payload.before);
    }
    case 'SET_TIMELINE_AFTER': {
      return state.set('timelineAfter', payload.after);
    }
    case 'ADD_NOTIFICATION': {
      let notifications = [...state.get('notifications')];
      notifications.push(payload.notification);
      return state.set('notifications', notifications);
    }
    case 'REMOVE_NOTIFICATION': {
      let notifications = [...state.get('notifications')];
      if (notifications.length < 2) {
        notifications = [];
      } else {
        notifications.splice(payload.notificationIndex, 1);
      }
      return state.set('notifications', notifications);
    }
    case 'TOGGLE_THEME': {
      const newTheme = state.get('theme') == 'light' ? 'dark' : 'light';
      localStorage.setItem('together-theme', newTheme);
      return state.set('theme', newTheme);
    }
    case 'LOGOUT': {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
