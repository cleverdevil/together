import io from 'socket.io-client'
import feathers, { socketio, authentication } from '@feathersjs/client'

const socket = io(process.env.REACT_APP_API_SERVER, {
  transports: ['websocket'],
  forceNew: true,
})

const client = feathers()

client.configure(socketio(socket, { timeout: 10000 }))
client.configure(
  authentication({
    storage: window.localStorage,
    entity: 'user',
    service: 'users',
  })
)
// Try to prevent login timeouts although I don't think it actually works
// TODO: investigate how to fix this
client.service('authentication').timeout = 20000
client.service('users').timeout = 20000

export const channels = client.service('api/channels')
export const posts = client.service('api/posts')
export const search = client.service('api/search')
export const follows = client.service('api/follows')
export const micropub = client.service('api/micropub')
export const users = client.service('users')
export { client }
