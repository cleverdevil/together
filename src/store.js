import { createStore, applyMiddleware } from 'redux';
import { bindWithDispatch } from 'feathers-redux';
import rootReducer, { services as rawServices } from './reducers';
import middlewares from './middleware';

const createStoreWithDevTools = window.devToolsExtension
  ? window.devToolsExtension()(createStore)
  : createStore;

const createStoreWithMiddlewares = applyMiddleware(...middlewares)(
  createStoreWithDevTools,
);

const store = createStoreWithMiddlewares(rootReducer);
store.dispatch(rawServices.channels.find());
const services = bindWithDispatch(store.dispatch, rawServices);

export default store;
export { services };
