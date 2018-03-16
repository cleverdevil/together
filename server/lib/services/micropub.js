const fetch = require('isomorphic-fetch');
const Micropub = require('micropub-helper');
const { URL } = require('url');

class MicropubService {
  constructor() {}

  /**
   * Run a query or source query
   * @param {string} id     The url for a source query or null for config query
   * @param {object} params Query params
   */
  get(id, params) {
    if (id) {
      return micropub.querySource(id, params.query.properties || []);
    } else {
      return micropub.query(params.query.query);
    }
  }

  create(params) {
    if (params.undelete) {
      return micropub.undelete(params.undelete);
    } else {
      return micropub.create(params.post, params.type || 'json');
    }
  }

  update(id, params) {
    return micropub.update(id, params.update);
  }

  remove(id, params) {
    return micropub.delete(id);
  }
}

module.exports = new MicropubService();
