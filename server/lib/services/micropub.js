class MicropubService {
  constructor() {}

  /**
   * Run a query or source query
   * @param {string} id     The url for a source query or null for config query
   * @param {object} params Query params
   */
  get(id, params) {
    if (id) {
      return params.micropub.querySource(id, params.query.properties || []);
    } else {
      return params.micropub.query(params.query.query);
    }
  }

  create(data, params) {
    if (data.undelete) {
      return params.micropub.undelete(data.undelete);
    } else {
      return params.micropub.create(data.post, data.type || 'json');
    }
  }

  update(id, params) {
    return params.micropub.update(id, params.update);
  }

  remove(id, params) {
    return params.micropub.delete(id);
  }
}

module.exports = new MicropubService();
