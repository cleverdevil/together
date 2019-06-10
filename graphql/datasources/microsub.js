const { RESTDataSource } = require('apollo-datasource-rest')
const { camelCase } = require('lodash')

const postReducer = post => {
  // Convert keys with dashes to camel case
  for (const key in post) {
    if (key.includes('-')) {
      const value = post[key]
      post[camelCase(key)] = value
      delete post[key]
    }
  }

  // Fix non array quotation-of https://github.com/aaronpk/Aperture/issues/57
  if (post.quotationOf && !Array.isArray(post.quotationOf)) {
    post.quotationOf = [post.quotationOf]
  }

  // Apply the same thing to refs too
  if (post.refs) {
    let reducedRefs = []
    for (const url in post.refs) {
      if (post.refs.hasOwnProperty(url)) {
        const refPost = postReducer(post.refs[url])
        reducedRefs.push(refPost)
      }
    }
    post.refs = reducedRefs
  }

  return post
}

class MicrosubAPI extends RESTDataSource {
  constructor() {
    super()
    this.channelReducer = this.channelReducer.bind(this)
  }

  /**
   * Get the microsub base url from the current user
   */
  get baseURL() {
    if (this.context.user && this.context.user.microsubEndpoint) {
      return this.context.user.microsubEndpoint
    }
    return null
  }

  /**
   * Adds the authorization header to microsub requests
   * @param {object} request The request object
   */
  willSendRequest(request) {
    request.headers.set('Authorization', 'Bearer ' + this.context.user.token)
  }

  channelReducer(channel) {
    let layout = 'timeline'
    let autoRead = true
    let infiniteScroll = true
    if (
      this.context.user &&
      this.context.user.settings &&
      this.context.user.settings.channels &&
      this.context.user.settings.channels[channel.uid]
    ) {
      // There are some channel settings
      const channelSettings = this.context.user.settings.channels[channel.uid]
      if (channelSettings.layout) {
        layout = channelSettings.layout
      }
      if (channelSettings.autoRead === false) {
        autoRead = channelSettings.autoRead
      }
      if (channelSettings.infiniteScroll === false) {
        infiniteScroll = channelSettings.infiniteScroll
      }
    }
    let data = {
      ...channel,
      _t_slug: encodeURIComponent(channel.uid),
      _t_layout: layout,
      _t_autoRead: autoRead,
      _t_infiniteScroll: infiniteScroll,
    }
    if (data.unread === null) {
      data.unread = -1
    }
    return data
  }

  async getTimeline({ channel, limit = 20, after = null, before = null }) {
    let params = { action: 'timeline', channel }
    if (limit !== null) {
      params.limit = limit
    }
    if (after !== null) {
      params.after = after
    }
    if (before !== null) {
      params.before = before
    }
    const res = await this.get('', params)
    const items = res.items.map(postReducer)

    return {
      channel,
      items,
      ...res.paging,
    }
  }

  async getPosts(query) {
    const { items } = await this.getTimeline(query)
    return items
  }

  async markPostRead(channel, entry) {
    const res = await this.post('', {
      action: 'timeline',
      method: 'mark_read',
      channel,
      entry,
    })
    return { channel, entry }
  }

  async markPostUnread(channel, entry) {
    const res = await this.post('', {
      action: 'timeline',
      method: 'mark_unread',
      channel,
      entry,
    })
    return { channel, entry }
  }

  async removePost(channel, entry) {
    const res = await this.post('', {
      action: 'timeline',
      method: 'remove',
      channel,
      entry,
    })
    return { channel, entry }
  }

  async markChannelRead(channel, entry) {
    const res = await this.post('', {
      action: 'timeline',
      method: 'mark_read',
      last_read_entry: entry,
      channel,
    })
    return res.result === 'ok'
    return { channel, success: res.result === 'ok', updated: res.updated }
  }

  async getAllChannels() {
    const res = await this.get('', { action: 'channels' })
    return res.channels.map(this.channelReducer)
  }

  async getFollowing(channel) {
    const res = await this.get('', { action: 'follow', channel })
    const following = res.items
    return following
  }

  async follow(channel, url) {
    const res = await this.post('', { action: 'follow', channel, url })
    return res
  }

  async unfollow(channel, url) {
    const res = await this.post('', { action: 'unfollow', channel, url })
    return res
  }

  async getMuted(channel) {
    const res = await this.get('', { action: 'mute', channel })
    const following = res.items
    return following
  }

  async mute(channel, url) {
    const res = await this.post('', { action: 'mute', channel, url })
    return url
  }

  async unmute(channel, url) {
    const res = await this.post('', { action: 'unmute', channel, url })
    return url
  }

  async getBlocked(channel) {
    const res = await this.get('', { action: 'block', channel })
    const following = res.items
    return following
  }

  async block(channel, url) {
    const res = await this.post('', { action: 'block', channel, url })
    return url
  }

  async unblock(channel, url) {
    const res = await this.post('', { action: 'unblock', channel, url })
    return url
  }

  async createChannel(name) {
    const res = await this.post('', { action: 'channels', name })
    return this.channelReducer(res)
  }

  async renameChannel(channel, name) {
    const res = await this.post('', { action: 'channels', channel, name })
    return name
  }

  async reorderChannels(channels) {
    const res = await this.post('', {
      action: 'channels',
      method: 'order',
      channels,
    })
    return res.channels.map(this.channelReducer)
  }

  async deleteChannel(channel) {
    const res = await this.post('', {
      action: 'channels',
      method: 'delete',
      channel,
    })
    return channel
  }

  async search(query) {
    let params = { action: 'search', query }
    const res = await this.post('', params)
    return res.results
  }

  async preview(url) {
    let params = { action: 'preview', url }
    const res = await this.get('', params)
    return res.items
  }
}

module.exports = MicrosubAPI
