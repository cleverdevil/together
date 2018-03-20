const nconf = require('nconf');

// NOTE: if you are customizing the config you may want to check the .env files that are applied to the frontend
nconf
  .argv()
  .env()
  .file({ file: __dirname + '/../../config.json' })
  .defaults({
    secret:
      'Some super secret code that will be overwritten by the config file',
    url: 'https://alltogethernow.io',
    port: 10008,
  });

module.exports = nconf;
