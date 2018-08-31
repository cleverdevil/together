import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import Theme from './components/theme';
import store from './store';
import serviceWorker from './service-worker';
import { addNotification } from './actions';

ReactDOM.render(
  <Provider store={store}>
    <Theme>
      <App />
    </Theme>
  </Provider>,
  document.getElementById('root'),
);

serviceWorker(() => {
  console.log('Worker updated');
  store.dispatch(
    addNotification('App updated. Reopen Together to load update'),
  );
});
