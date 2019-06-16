require('dotenv').config()
const { ApolloServer } = require('apollo-server')
const schema = require('./schema')
const resolvers = require('./resolvers')
const MicrosubAPI = require('./datasources/microsub')
const MicropubAPI = require('./datasources/micropub')
const IndieAuthAPI = require('./datasources/indieauth')
const MongoAPI = require('./datasources/mongo')
const users = new MongoAPI()

// set up any dataSources our resolvers need
const dataSources = () => ({
  microsub: new MicrosubAPI(),
  micropub: new MicropubAPI(),
  indieauth: new IndieAuthAPI(),
  mongo: users,
})

const context = async ({ req, connection }) => {
  // simple auth check on every request
  if (connection) {
    // check connection for metadata
    return connection.context
  } else {
    try {
      const auth = (req.headers && req.headers.authorization) || ''
      const user = await users.findOrCreateUser(auth)
      return { user }
    } catch (err) {
      return { user: {} }
    }
  }
}

const server = new ApolloServer({
  typeDefs: schema,
  dataSources,
  resolvers,
  context,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      try {
        const auth = (connectionParams && connectionParams.authToken) || ''
        const user = await users.findOrCreateUser(auth)
        console.log('[websocket connect]', user.url)
        return { user }
      } catch (err) {
        return { user: {} }
      }
    },
    // onDisconnect: (webSocket, context) => {
    //   console.log('Socket disconnect')
    // },
  },
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
})
