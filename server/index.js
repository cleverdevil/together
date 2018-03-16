const path = require('path');
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const authentication = require('@feathersjs/authentication');
const custom = require('feathers-authentication-custom');
const jwt = require('@feathersjs/authentication-jwt');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('isomorphic-fetch');
const micropubRoute = require('./lib/middlewear/micropub');
const channels = require('./lib/services/channels');
const posts = require('./lib/services/posts');
const follows = require('./lib/services/follows');
const search = require('./lib/services/search');
const users = require('./lib/services/users');
const micropubService = require('./lib/services/micropub');
const authHooks = require('feathers-authentication-hooks');
const relScraper = require('./lib/rel-scraper');
const Micropub = require('micropub-helper');

const app = express(feathers());
app.configure(express.rest());

app.configure(
  authentication({
    // TODO: move this somewhere else and dont commit it
    secret: 'This is a top secret code for together',
    service: 'users',
    jwt: {
      audience: 'https://alltogethernow.io',
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
        clientId: 'https://alltogethernow.io',
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
                    rels: rels,
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
app.use('users', users);

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
    all: [authHooks.queryWithCurrentUser()],
  },
});

app.all('/api/micropub/:method', micropubRoute);

app.post('/api/rels', (req, res, next) => {
  if (!req.body.url) {
    res.status(400);
    res.json({ error: 'missing url' });
  } else {
    relScraper(req.body.url)
      .then(rels => {
        res.json({
          rels: rels,
        });
      })
      .catch(err => {
        res.status(500);
        res.json({ error: 'Error getting rels' });
      });
  }
});

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../build/index.html'));
});

app.listen(process.env.PORT || 10008);
console.log(`Watching on ${process.env.PORT || 10008}`);
