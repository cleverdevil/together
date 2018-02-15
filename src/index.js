import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import Store from './store';
import serviceWorker from './service-worker';
import { addNotification } from './actions';

const StoreInstance = Store();

ReactDOM.render(
  <Provider store={StoreInstance}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

serviceWorker(() => {
  console.log('Worker updated');
  StoreInstance.dispatch(
    addNotification('App updated. Reopen Together to load update'),
  );
});
