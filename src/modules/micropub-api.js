const localStoragePrefix = 'micropub_';
const optionKeys = [
  'me',
  'scope',
  'token',
  'authEndpoint',
  'tokenEndpoint',
  'micropubEndpoint',
  'state',
];

// Load options from localStorage
let options = {
  scope: 'post create delete update read follow mute block channels',
};
optionKeys.forEach(key => {
  const value = localStorage.getItem(localStoragePrefix + key);
  if (value) {
    options[key] = value;
  }
});

const saveOptions = data => {
  if (data && typeof data === 'object') {
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (optionKeys.indexOf(key) > -1) {
        options[key] = value;
        localStorage.setItem(localStoragePrefix + key, value);
      }
    });
  }
};

export default function(method, params = {}) {
  return new Promise((resolve, reject) => {
    saveOptions(params);
    const data = Object.assign(options, params);
    fetch(process.env.REACT_APP_API_SERVER + '/api/micropub/' + method, {
      method: 'post',
      // mode: 'no-cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (!res.ok) {
          reject();
        } else {
          return res.json();
        }
      })
      .then(data => {
        if (data && data.result) {
          if (data.options) {
            saveOptions(data.options);
          }
          resolve(data.result);
        } else {
          reject();
        }
      });
  });
}

export function getOption(key) {
  return options[key];
}

export function setOption(key, value) {
  options[key] = value;
  if (optionKeys.indexOf(key) > -1) {
    if (!value) {
      localStorage.removeItem(localStoragePrefix + key);
    } else {
      localStorage.setItem(localStoragePrefix + key, value);
    }
  }
}

export function getRels(url = options.me) {
  console.log('running get rels function');
  return new Promise((resolve, reject) => {
    if (!url) {
      console.log('missing url');
      return reject('missing url');
    }
    console.log('requesting rels');
    fetch(process.env.REACT_APP_API_SERVER + '/api/rels', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }),
    })
      .then(res => res.json())
      .then(rels => resolve(rels.rels))
      .catch(err => reject(err));
  });
}
