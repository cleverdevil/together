const Microsub = require('../microsub');

module.exports = (req, res, next) => {
  req.body.clientId = 'http://together.tpxl.io';
  let microsub = new Microsub(req.body);
  let params = req.body.params || [];
  microsub[req.params.method](...params)
    .then((result) => {
      res.json({
        result: result,
        options: microsub.options,
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
}
