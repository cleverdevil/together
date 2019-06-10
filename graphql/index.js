require('dotenv').config()
const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')
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

const context = async ({ req }) => {
  // simple auth check on every request
  try {
    const auth = (req.headers && req.headers.authorization) || ''
    const user = await users.findOrCreateUser(auth)
    return { user }
  } catch (err) {
    return { user: {} }
  }
}

const server = new ApolloServer({
  typeDefs,
  dataSources,
  resolvers,
  context,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
