import { createStore } from 'redux';
import rootReducer, { services as rawServices } from './reducers';
import { bindWithDispatch } from 'feathers-redux';

const createStoreWithDevTools = window.devToolsExtension
  ? window.devToolsExtension()(createStore)
  : createStore;
const store = createStoreWithDevTools(rootReducer);
const services = bindWithDispatch(store.dispatch, rawServices);
export default store;
export { services };
