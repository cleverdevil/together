const fetch = require('isomorphic-fetch');
const Micropub = require('micropub-helper');
const { URL } = require('url');

const microsubError = (message, status = null, error = null) => {
  return {
    message: message,
    status: status,
    error: error,
  };
};

const validateResponse = res => {
  return new Promise((resolve, reject) => {
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
};

class SearchService {
  constructor() {}

  /**
   * Get feeds for the given search text
   * @param {object} params Search parameters
   */
  find(params) {
    return new Promise((resolve, reject) => {
      console.log(params);
      const url = new URL(params.user.rels.microsub);
      url.searchParams.append('action', 'search');
      url.searchParams.append('query', params.query.search);
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + params.user.accessToken,
        }),
      })
        .then(res => res.json())
        .then(results => {
          resolve(results.results);
        })
        .catch(err => {
          reject(microsubError('Error searching', null, err));
        });
    });
  }

  /**
   * Get a preview of the given url
   * @param {string} id     The url to preview
   * @param {object} params Query params
   */
  get(id, params) {
    return new Promise((resolve, reject) => {
      const url = new URL(params.user.rels.microsub);
      url.searchParams.append('action', 'preview');
      url.searchParams.append('url', id);
      fetch(url.toString(), {
        method: 'GET',
        headers: new Headers({
          Authorization: 'Bearer ' + params.user.accessToken,
        }),
      })
        .then(res => res.json())
        .then(results => {
          resolve(results);
        })
        .catch(err => {
          reject(microsubError('Error getting preview', null, err));
        });
    });
  }
}

module.exports = new SearchService();
