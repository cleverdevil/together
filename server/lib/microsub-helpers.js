const fetch = require('isomorphic-fetch');
const { URL } = require('url');

const microsubError = (message, status = null, error = null) => {
  return {
    message: message,
    status: status,
    error: error,
  };
};

const validateResponse = res =>
  new Promise((resolve, reject) => {
    if (res.ok) {
      resolve(res.json());
    } else {
      res
        .text()
        .then(text => {
          console.log(text);
          reject(microsubError('Error from microsub server', res.status));
        })
        .catch(() =>
          reject(microsubError('Error from microsub server', res.status)),
        );
    }
  });

const request = ({ endpoint, token, params = {}, method = 'GET' }) =>
  new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    Object.keys(params).forEach(key => {
      const value = params[key];
      url.searchParams.append(key, value);
    });
    fetch(url.toString(), {
      method: method,
      headers: new Headers({
        Authorization: 'Bearer ' + token,
      }),
    })
      .then(res => validateResponse(res))
      .then(res => resolve(res))
      .catch(err => reject(err));
  });

module.exports = {
  validateResponse: validateResponse,
  microsubError: microsubError,
  request: request,
};
