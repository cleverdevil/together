module.exports = function (htmlString, url) {
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
    relEls.forEach((relEl) => {
      const names = relEl.getAttribute('rel').toLowerCase().split("\\s+");
      const value = relEl.getAttribute('href');
      if (names.length && value !== null) {
        names.forEach((name) => {
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