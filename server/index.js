const path = require('path');
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const authentication = require('@feathersjs/authentication');
const custom = require('feathers-authentication-custom');
const jwt = require('@feathersjs/authentication-jwt');
const authHooks = require('feathers-authentication-hooks');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('isomorphic-fetch');
const channels = require('./lib/services/channels');
const posts = require('./lib/services/posts');
const follows = require('./lib/services/follows');
const search = require('./lib/services/search');
const users = require('./lib/services/users');
const micropubService = require('./lib/services/micropub');
const requireUserHook = require('./lib/hooks/require-user');
const initiateMicropubHook = require('./lib/hooks/initiate-micropub');
const relScraper = require('./lib/rel-scraper');
const config = require('./lib/config');
const Micropub = require('micropub-helper');

const app = express(feathers());
app.configure(express.rest());

app.configure(
  authentication({
    secret: config.get('secret'),
    service: 'users',
    jwt: {
      audience: config.get('url'),
    },
  }),
);

app.configure(
  custom((req, done) => {
    if (
      req.body &&
      req.body.me &&
      req.body.state &&
      req.body.code &&
      req.body.redirectUri
    ) {
      let micropub = new Micropub({
        me: req.body.me,
        state: req.body.state,
        redirectUri: req.body.redirectUri,
        clientId: config.get('url'),
        scope: 'post create delete update read follow mute block channels',
      });
      relScraper(req.body.me)
        .then(rels => {
          if (
            !rels.micropub ||
            !rels.microsub ||
            !rels.authorization_endpoint ||
            !rels.token_endpoint
          ) {
            return done(null, false, {
              message: 'Could not parse all required endpoints from your site',
            });
          } else {
            micropub.options.authEndpoint = rels.authorization_endpoint;
            micropub.options.tokenEndpoint = rels.token_endpoint;
            micropub.options.micropubEndpoint = rels.micropub;
            micropub
              .getToken(req.body.code)
              .then(accessToken => {
                app
                  .service('users')
                  .create({
                    me: req.body.me,
                    accessToken: accessToken,
                    settings: {
                      authEndpoint: rels.authorization_endpoint,
                      tokenEndpoint: rels.token_endpoint,
                      micropubEndpoint: rels.micropub,
                      microsubEndpoint: rels.microsub,
                    },
                  })
                  .then(user => done(null, { ...user, id: user._id }))
                  .catch(err =>
                    done(null, false, {
                      message: 'Error creating user in the database',
                    }),
                  );
              })
              .catch(err => done(null, false, { message: err.message }));
          }
        })
        .catch(err => done(null, false, { message: err }));
    } else {
      return done(null, false, { message: 'Missing a login parameter' });
    }
  }),
);

app.configure(jwt());

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build'));
app.configure(socketio({ pingTimeout: 10000 }));

// Services
app.use('/api/channels', channels);
app.use('/api/posts', posts);
app.use('/api/follows', follows);
app.use('/api/search', search);
app.use('/api/micropub', micropubService);
app.use('/users', users);

// Hooks
app.service('authentication').hooks({
  before: {
    create: [
      authentication.hooks.authenticate(['jwt', 'custom']),
      hook => {
        hook.params.payload = {
          userId: hook.params.user._id,
          me: hook.params.user.me,
        };
      },
    ],
    remove: authentication.hooks.authenticate('jwt'),
  },
});

app.service('/api/channels').hooks({
  before: {
    all: [authHooks.queryWithCurrentUser(), requireUserHook],
  },
});

app.service('/api/posts').hooks({
  before: {
    all: [authHooks.queryWithCurrentUser(), requireUserHook],
  },
});

app.service('/api/follows').hooks({
  before: {
    all: [authHooks.queryWithCurrentUser(), requireUserHook],
  },
});

app.service('/api/search').hooks({
  before: {
    all: [authHooks.queryWithCurrentUser(), requireUserHook],
  },
});

app.service('/api/micropub').hooks({
  before: {
    all: [
      authHooks.queryWithCurrentUser(),
      requireUserHook,
      initiateMicropubHook,
    ],
  },
});

app.service('users').hooks({
  before: {
    patch: [authHooks.restrictToOwner({ ownerField: '_id' })],
    update: [authHooks.restrictToOwner({ ownerField: '_id' })],
  },
});

app.post('/api/getAuthUrl', (req, res, next) => {
  if (!req.body.me || !req.body.state || !req.body.redirectUri) {
    res.status(400);
    res.json({ error: 'Missing required parameter' });
  } else {
    const micropub = new Micropub({
      me: req.body.me,
      state: req.body.state,
      redirectUri: req.body.redirectUri,
      scope: 'post create delete update read follow mute block channels',
      clientId: config.get('url'),
    });
    micropub
      .getAuthUrl()
      .then(url => res.json({ url: url }))
      .catch(err => {
        res.status(err.status || 500);
        res.json({ error: err.message });
      });
  }
});

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../build/index.html'));
});

app.listen(process.env.PORT || config.get('port'));
console.log(`Watching on ${process.env.PORT || config.get('port')}`);
