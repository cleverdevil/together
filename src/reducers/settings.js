import { Map } from 'immutable';

const emptyState = {
  reactions: false,
  syndicationProviders: [],
  likeSyndication: [],
  repostSyndication: [],
  noteSyndication: [],
};

let initialState = new Map();
for (const key in emptyState) {
  const localValue = localStorage.getItem(`together-setting-${key}`);
  if (localValue) {
    initialState = initialState.set(key, JSON.parse(localValue));
  } else {
    initialState = initialState.set(key, emptyState[key]);
  }
}

export default (state = initialState, payload) => {
  switch (payload.type) {
    case 'SET_SETTING': {
      localStorage.setItem(
        `together-setting-${payload.key}`,
        JSON.stringify(payload.value),
      );
      return state.set(payload.key, payload.value);
    }
    case 'LOGOUT': {
      return state.map((value, key) => {
        localStorage.removeItem(`together-setting-${key}`);
        return emptyState[key];
      });
    }
    default: {
      return state;
    }
  }
};
