const fetch = require('isomorphic-fetch');

module.exports = function(url) {
  let baseUrl = url;
  let endpoints = {
    micropub: null,
    microsub: null,
    authorization_endpoint: null,
    token_endpoint: null,
    media_endpoint: null,
  };

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => {
        if (!res.ok) {
          return reject('Error getting page');
        }
        baseUrl = res.url;

        // Check for endpoints in headers
        const linkHeaders = res.headers.get('link');
        if (linkHeaders) {
          const links = linkHeaders.split(',');
          links.forEach(link => {
            Object.keys(endpoints).forEach(key => {
              const rel = link.match(/rel=("([^"]*)"|([^,"<]+))/);
              if (
                rel &&
                rel[1] &&
                (' ' + rel[1].toLowerCase() + ' ').indexOf(' ' + key + ' ') >= 0
              ) {
                const linkValues = link.match(/[^<>|\s]+/g);
                if (linkValues && linkValues[0]) {
                  let endpointUrl = linkValues[0];
                  endpointUrl = new URL(endpointUrl, url).toString();
                  endpoints[key] = endpointUrl;
                }
              }
            });
          });
        }
        return res.text();
      })
      .then(html => {
        // Get rel links
        const rels = htmlScraper(html, baseUrl);

        // Save necessary endpoints.
        if (rels) {
          Object.keys(endpoints).forEach(key => {
            if (rels[key] && rels[key][0]) {
              endpoints[key] = rels[key][0];
            }
          });
        }
        return resolve(endpoints);
      })
      .catch(err => {
        console.log(err);
        reject('Error fetching url');
      });
  });
};

function htmlScraper(htmlString, url) {
  let rels = {};
  let baseUrl = url;

  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  const baseEl = doc.querySelector('base[href]');
  const relEls = doc.querySelectorAll('[rel][href]');

  if (baseEl) {
    const value = baseEl.getAttribute('href');
    const url = new URL(value, url);
    baseUrl = url.toString();
  }

  if (relEls.length) {
    relEls.forEach(relEl => {
      const names = relEl
        .getAttribute('rel')
        .toLowerCase()
        .split('\\s+');
      const value = relEl.getAttribute('href');
      if (names.length && value !== null) {
        names.forEach(name => {
          if (!rels[name]) {
            rels[name] = [];
          }
          const url = new URL(value, baseUrl).toString();
          if (rels[name].indexOf(url) === -1) {
            rels[name].push(url);
          }
        });
      }
    });
  }

  return rels;
}
