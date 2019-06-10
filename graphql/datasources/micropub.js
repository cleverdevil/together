const { DataSource } = require('apollo-datasource')
const micropub = require('../lib/micropub')

class MicropubAPI extends DataSource {
  constructor() {
    super()
    this.micropub = micropub
  }

  initialize(config) {
    this.context = config.context
    this.micropub.options.me = this.context.user.url
    this.micropub.options.micropubEndpoint = this.context.user.micropubEndpoint
    this.micropub.options.token = this.context.user.token
  }

  async query(query) {
    return await this.micropub.query(query)
  }

  async querySource(url) {
    return await this.micropub.querySource(url)
  }

  async create(post, type = 'json') {
    return await this.micropub.create(post, type)
  }

  async delete(url) {
    return await this.micropub.delete(url)
  }

  async undelete(url) {
    return await this.micropub.undelete(url)
  }

  async update(url, update) {
    return await this.micropub.update(url, update)
  }
}

module.exports = MicropubAPI
