const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('isomorphic-fetch');
const micropubRoute = require('./lib/middlewear/micropub');
const microsubRoute = require('./lib/middlewear/microsub');
const relScraper = require('./lib/rel-scraper');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build'));

app.all('/api/micropub/:method', micropubRoute);
app.all('/api/microsub/:method', microsubRoute);

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
