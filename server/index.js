const path = require('path');
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('isomorphic-fetch');
const micropubRoute = require('./lib/middlewear/micropub');
const channels = require('./lib/services/channels');
const posts = require('./lib/services/posts');
const follows = require('./lib/services/follows');
const search = require('./lib/services/search');
const relScraper = require('./lib/rel-scraper');

const app = express(feathers());

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build'));
app.configure(socketio());
app.use('/api/channels', channels);
app.use('/api/posts', posts);
app.use('/api/follows', follows);
app.use('/api/search', search);

app.all('/api/micropub/:method', micropubRoute);

app.post('/api/rels', (req, res, next) => {
  if (!req.body.url) {
    res.status(400);
    res.json({ error: 'missing url' });
  } else {
    fetch(req.body.url)
      .then(result => result.text())
      .then(html => {
        res.json({
          rels: relScraper(html, req.body.url),
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
