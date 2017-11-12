const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Micropub = require('micropub-helper');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.all('/micropub/:method', (req, res, next) => {
  req.body.clientId = 'http://together.com';
  let micropub = new Micropub(req.body);
  micropub[req.params.method](req.body.param)
    .then((result) => {
      res.json({
        result: result,
        options: micropub.options,
      });
    })
    .catch((err) => {
      let status = 500;
      if (err.status) {
        status = err.status;
      }
      res.status(status);
      res.json(err);
    });
});

app.listen(process.env.PORT || 8080);
console.log(`Watching on ${process.env.PORT || 8080}`)