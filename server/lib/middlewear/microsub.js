const Microsub = require('../microsub');

module.exports = function(req, res, next) {
  req.body.clientId = 'http://together.tpxl.io';
  const microsub = new Microsub(req.body);
  const params = req.body.params || [];
  if (!microsub[req.params.method]) {
    res.status(404);
    res.json({ error: 'Route not found' });
  } else {
    microsub[req.params.method](...params)
      .then(result => {
        res.json({
          result: result,
          options: microsub.options,
        });
      })
      .catch(err => {
        let status = 500;
        if (err.status) {
          status = err.status;
        }
        if (err instanceof Error) {
          err = {
            message: err.message,
            status: status,
            err: err,
          };
        } else if (!err.message) {
          err = {
            message: 'Unknown error',
            status: status,
            err: err,
          };
        }
        res.status(status);
        res.json(err);
      });
  }
};
