import { combineReducers } from 'redux';
import reduxifyServices from 'feathers-redux';
import { client } from '../modules/feathers-services';

import app from './app';
import notifications from './notifications';
import posts from './posts';
// import channels from './channels';
import user from './user';
import settings from './settings';

const services = reduxifyServices(client, [
  'api/channels',
  'api/posts',
  'api/search',
  'api/follows',
  'api/micropub',
  'users',
]);
const namedServices = {
  channels: services['api/channels'],
  posts: services['api/posts'],
  search: services['api/search'],
  follows: services['api/follows'],
  micropub: services['api/micropub'],
  users: services['users'],
};

const rootReducer = combineReducers({
  app,
  notifications,
  posts,
  // channels,
  user,
  settings,
  channels: namedServices.channels.reducer,
  feathersposts: namedServices.posts.reducer,
  featherssearch: namedServices.search.reducer,
  feathersfollows: namedServices.follows.reducer,
  feathersmicropub: namedServices.micropub.reducer,
  feathersusers: services['users'].reducer,
});

export default rootReducer;
export { namedServices as services };
