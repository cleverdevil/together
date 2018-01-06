const Micropub = require('micropub-helper');

module.exports = (req, res, next) => {
  req.body.clientId = 'http://together.tpxl.io';
  let micropub = new Micropub(req.body);
  if (!micropub[req.params.method]) {
    res.status(404);
    res.json({ error: 'Route not found' });
  } else {
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
  }
}
