import { Map } from 'immutable';
import notification from '../components/notification';

const defaultState = new Map({
  channelsMenuOpen: false,
  selectedChannel: '',
  timelineBefore: '',
  timelineAfter: '',
  notifications: [],
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
    default: {
      return state;
    }
  }
};