import { createStore } from 'redux';
import rootReducer from './reducers';
export default initialState => {
  const createStoreWithDevTools = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;
  return createStoreWithDevTools(rootReducer, initialState);
};
