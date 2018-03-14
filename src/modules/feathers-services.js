import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';

const socket = io(process.env.REACT_APP_API_SERVER, {
  transports: ['websocket'],
  forceNew: true,
});

const client = feathers();

client.configure(socketio(socket));

export const channels = client.service('api/channels');
export const posts = client.service('api/posts');
export const search = client.service('api/search');
export const follows = client.service('api/follows');
