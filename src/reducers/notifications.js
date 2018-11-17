import { Map, List } from 'immutable';

const defaultState = new Map({
  name: '',
  uid: '',
  unread: 0,
  notifications: new List([]),
});

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'ADD_MICROSUB_NOTIFICATION': {
      return state.update('notifications', notifications =>
        notifications.push(new Map(payload.post)),
      );
    }
    case 'ADD_MICROSUB_NOTIFICATIONS': {
      // TODO: Needs to append not replace
      return state.update('notifications', notifications =>
        payload.posts.forEach(
          post => (notifications = notifications.push(new Map(post))),
        ),
      );
    }
    case 'REPLACE_MICROSUB_NOTIFICATIONS': {
      return state.set(
        'notifications',
        new List(payload.posts.map(post => new Map(post))),
      );
    }
    case 'UPDATE_POST': {
      const index = state
        .get('notifications')
        .findIndex(post => post.get('_id') === payload.id);
      if (index > -1) {
        return state.update('notifications', notifications =>
          notifications.update(index, post =>
            post.set(payload.key, payload.value),
          ),
        );
      }
      return state;
    }
    case 'ADD_CHANNEL': {
      if (payload.uid === 'notifications') {
        return state
          .set('uid', payload.uid)
          .set('name', payload.name)
          .set('unread', payload.unread);
      }
      return state;
    }
    case 'UPDATE_CHANNEL': {
      if (payload.uid === 'notifications' && payload.key === 'unread') {
        return state.set('unread', payload.value);
      }
      return state;
    }
    case 'DECREMENT_CHANNEL_UNREAD': {
      if (payload.uid === 'notifications') {
        return state.update('unread', unread => (unread ? unread - 1 : 0));
      }
      return state;
    }
    case 'INCREMENT_CHANNEL_UNREAD': {
      if (payload.uid === 'notifications') {
        return state.update('unread', unread => unread + 1);
      }
      return state;
    }
    case 'LOGOUT': {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
