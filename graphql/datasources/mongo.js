const { DataSource } = require('apollo-datasource')
const mongoose = require('mongoose')
const jwt = require('../lib/jwt')

if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGO, { useNewUrlParser: true })
    .then(() => console.log('💾 connected to the mongo user database'))
    .catch(err => console.log('Error connecting to mongo', err))
}

const Schema = mongoose.Schema

const User = new Schema({
  url: String,
  photo: String,
  token: String,
  microsubEndpoint: String,
  micropubEndpoint: String,
  settings: {},
})

class UserAPI extends DataSource {
  constructor() {
    super()
    this.User = mongoose.model('User', User)
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context
  }

  /**
   * Get a user from their JWT
   * @param {string} token The user JWT
   */
  async getUser(token) {
    const url = jwt.decode(token)
    if (!url) {
      return null
    }
    const user = await this.User.findOne({ url }).exec()
    return user
  }

  /**
   * Create a new user
   * @param {object} userData User data object
   */
  async createUser(userData) {
    const user = new this.User(userData)
    const res = await user.save()
    return res
  }

  /**
   * Get or create a user in the database
   * @param {string} token The user JWT token
   * @param {object} data A user object
   */
  async findOrCreateUser(token, data = null) {
    let user = await this.getUser(token)
    if (!user) {
      // No user so need to create one.
      const url = jwt.decode(token)
      if (!url) {
        throw new Error('JWT not valid')
      }
      if (!data) {
        // TODO: May need to create data by getting rels from url, etc...
        // TODO: Parse user mf2 to get photo and name - may want to do that in the indieauth datasource
      }
      user = Object.assign(
        {},
        {
          photo: '',
          name: '',
          settings: {},
        },
        data
      )
      await this.createUser(user)
    }
    return user
  }

  async setChannelOption(channel, key, value) {
    // Validate option key
    if (key.startsWith('_t_')) {
      key = key.substring(3)
    }
    if (key === 'slug') {
      // Slug is just a helper that shouldn't be updated
      return true
    }

    const validKeys = ['layout', 'autoRead', 'infiniteScroll']
    if (!validKeys.includes(key)) {
      throw new Error(`${key} is not a valid channel option`)
    }

    const res = await this.User.findOneAndUpdate(
      {
        _id: this.context.user._id,
      },
      {
        [`settings.channels.${channel}.${key}`]: value,
      },
      {
        upsert: true,
      }
    ).exec()

    return true
  }

  async setOption(key, value) {
    // Validate option key
    const validKeys = [
      'likeSyndication',
      'repostSyndication',
      'noteSyndication',
    ]
    if (!validKeys.includes(key)) {
      throw new Error(`${key} is not a valid option`)
    }
    const res = await this.User.findOneAndUpdate(
      {
        _id: this.context.user._id,
      },
      {
        [`settings.${key}`]: value,
      },
      {
        upsert: true,
      }
    ).exec()
    return true
  }
}

module.exports = UserAPI
