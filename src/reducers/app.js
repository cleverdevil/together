import { Map } from 'immutable';

const defaultState = new Map({
  channelsMenuOpen: false,
  selectedChannel: '',
  timelineBefore: '',
  timelineAfter: '',
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
    default: {
      return state;
    }
  }
};