import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import Theme from './components/Theme'
import store from './store'
import serviceWorker from './service-worker'
import { addNotification } from './actions'

ReactDOM.render(
  <Provider store={store}>
    <Theme>
      <App />
    </Theme>
  </Provider>,
  document.getElementById('root')
)

serviceWorker(() => {
  console.log('Worker updated')
  store.dispatch(addNotification('App updated. Reopen Together to load update'))
})
