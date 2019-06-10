import ApolloClient from 'apollo-client'
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { getTheme } from './windows-functions'
import { version } from '../../package.json'
import { GET_CHANNELS } from '../queries'
const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      channel: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: 'Channel', uid: args.uid }),
    },
  },
  dataIdFromObject: object => {
    switch (object.__typename) {
      case 'Channel':
        // Channel always have a unique uid identifier
        return object.uid
      case 'Post':
        // Posts should have an _id but not always (refs etc...)
        if (object._id) {
          return object._id
        }
        // Url is the second most unique thing
        if (object.url) {
          return object.url
        }
        // Not so unique
        return defaultDataIdFromObject(object)
      case 'PostAuthor':
        // Authors should have an url but not always
        if (object.url) {
          return object.url
        }
        // Not so unique
        return defaultDataIdFromObject(object)
      default: {
        // Probably don't need anything for this type
        // console.log('no dataid handler for ', object.__typename, object)
        return defaultDataIdFromObject(object)
      }
    }
  },
})

const typeDefs = gql`
  extend type Query {
    currentChannel: Channel!
  }
`

const link = createHttpLink({
  uri: 'http://localhost:4000', // TODO: Do not hard code this
  includeExtensions: true,
  headers: {
    authorization: localStorage.getItem('token'),
    'client-name': 'Together [web]',
    'client-version': version,
  },
})

const client = new ApolloClient({
  cache,
  typeDefs,
  link,
  connectToDevTools: true,
  resolvers: {},
})

const initialAppState = () => ({
  channelsMenuOpen: false,
  focusedComponent: null,
  shortcutHelpOpen: false,
  token: localStorage.getItem('token'),
  theme: localStorage.getItem('together-theme') || getTheme() || 'light',
})

cache.writeData({ data: initialAppState() })

client.onResetStore(() => {
  console.log('resetting store', cache)
  cache.writeData({ data: initialAppState() })
  cache.writeQuery({ query: GET_CHANNELS, data: { channels: [] } })
})

export default client
