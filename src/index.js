import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import client from './modules/apollo'
import App from './containers/App'
import Theme from './components/Theme'
import Context from './containers/context'
import serviceWorker from './service-worker'

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Context>
        <Theme>
          <App />
        </Theme>
      </Context>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('root')
)

serviceWorker(() => {
  console.log('Worker updated')
  //   store.dispatch(addNotification('App updated. Reopen Together to load update'))
})
