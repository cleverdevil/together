import ApolloClient from 'apollo-client'
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { getTheme } from './windows-functions'
import { version } from '../../package.json'

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
  // uri: 'http://localhost:4000', // TODO: Do not hard code this
  resolvers: {
    Query: {
      currentChannel: async (_, __, { cache, client }) => {
        const query = gql`
          query GetSelectedChannel {
            selectedChannel @client
          }
        `
        const timelineQuery = gql`
          # query GetTimeline($channel: String!) {
          #   timeline(channel: $channel) {
          #     channel
          #     items {
          #       _id
          #     }
          #   }
          # }
          query GetChannel($uid: ID!) {
            channel(uid: $uid) {
              uid
            }
          }
        `
        const { selectedChannel } = cache.readQuery({ query })
        console.log('selected channel', selectedChannel)
        if (!selectedChannel) {
          return null
        }
        try {
          const res = cache.readQuery({
            query: timelineQuery,
            variables: { channel: selectedChannel },
          })
          console.log('res', res)
        } catch (err) {
          console.log('Error reading timeline from cache', err)
        }

        return null
        // // const { data } = await client.query({ query })
        // let currentChannel = null
        // if (data.selectedChannel && data.channels) {
        //   currentChannel = data.channels.find(
        //     channel => channel.uid === data.selectedChannel
        //   )
        // }
        // return currentChannel
      },
    },
    Mutation: {
      toggleTheme: (_, __, { cache }) => {
        const query = gql`
          query GetTheme {
            theme @client
          }
        `
        const previous = cache.readQuery({ query })
        console.log('Updating', previous)

        cache.writeData({ theme: 'dark' })
      },
      toggleChannelMenu: (_, __, { cache }) => {
        const query = gql`
          query GetChannelMenuOpen {
            channelsMenuOpen @client
          }
        `
        const previous = cache.readQuery({ query })
        console.log('Updating', previous)

        cache.writeData({ channelsMenuOpen: true })
      },
    },
  },
})

const initialAppState = {
  channelsMenuOpen: false,
  focusedComponent: null,
  shortcutHelpOpen: false,
  token: localStorage.getItem('token'),
  theme: localStorage.getItem('together-theme') || getTheme() || 'light',
}

cache.writeData({ data: initialAppState })

client.onResetStore(() => cache.writeData({ data: initialAppState }))

export default client
