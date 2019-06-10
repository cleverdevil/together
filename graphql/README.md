# Together Server

This is a work in progress GraphQL server that aims to bridge microsub and micropub clients to make it easier to develop multi device clients using modern technologies

## Setup

To run this server you first need a MongoDB server running to persist user data.

Then create a `.env` file (or environment variables) with the following variables set:

```
URL=http://localhost:3000
API_SERVER=http://localhost:4000
MONGO=http://mongodb.url
AUTH_SECRET=authsecret
JWT_SECRET=supersecretjwtsecret
```