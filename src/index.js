import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import Theme from './components/theme';
import Store from './store';
import serviceWorker from './service-worker';
import { addNotification } from './actions';

const StoreInstance = Store();

ReactDOM.render(
  <Provider store={StoreInstance}>
    <Theme>
      <App />
    </Theme>
  </Provider>,
  document.getElementById('root'),
);

serviceWorker(() => {
  console.log('Worker updated');
  StoreInstance.dispatch(
    addNotification('App updated. Reopen Together to load update'),
  );
});
