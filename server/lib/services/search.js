const {
  microsubError,
  validateResponse,
  request,
} = require('../microsub-helpers');

class SearchService {
  constructor() {}

  /**
   * Get feeds for the given search text
   * @param {object} params Search parameters
   */
  find(params) {
    return new Promise((resolve, reject) => {
      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'POST',
        params: {
          action: 'search',
          query: params.query.search,
        },
      })
        .then(results => resolve(results.results))
        .catch(err => reject(microsubError('Error searching', null, err)));
    });
  }

  /**
   * Get a preview of the given url
   * @param {string} id     The url to preview
   * @param {object} params Query params
   */
  get(id, params) {
    return new Promise((resolve, reject) => {
      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'GET',
        params: {
          action: 'preview',
          url: id,
        },
      })
        .then(results => resolve(results))
        .catch(err =>
          reject(microsubError('Error getting preview', null, err)),
        );
    });
  }
}

module.exports = new SearchService();
