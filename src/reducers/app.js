import { Map } from 'immutable';

const defaultState = new Map({
  channelsMenuOpen: false,
  selectedChannel: 'default',
});

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'TOGGLE_CHANNELS_MENU': {
      return state.set('channelsMenuOpen', !state.get('channelsMenuOpen'));
    }
    case 'SET_SELECTED_CHANNEL': {
      return state.set('selectedChannel', payload.uid);
    }
    default: {
      return state;
    }
  }
};