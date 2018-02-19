import micropubApi from './micropub-api';

export function note(content) {
  let mf = {
      type: ['h-entry'],
      properties: {
        content: [content],
      },
  };
  const syndication = localStorage.getItem('together-setting-noteSyndication');
  if (syndication && syndication.length > 0) {
    mf.properties['mp-syndicate-to'] = JSON.parse(syndication);
  }
  return micropubApi('create', {
    param: mf, 
  });
}

export function like(url) {
  let mf = {
    type: ['h-entry'],
    properties: {
      'like-of': [url],
    },
  };
  const syndication = localStorage.getItem('together-setting-likeSyndication');
  if (syndication && syndication.length > 0) {
    mf.properties['mp-syndicate-to'] = JSON.parse(syndication);
  }
  return micropubApi('create', {
    param: mf,
  });
}

export function repost(url) {
  let mf = {
    type: ['h-entry'],
    properties: {
      'repost-of': [url],
    },
  };
  const syndication = localStorage.getItem(
    'together-setting-repostSyndication',
  );
  if (syndication && syndication.length > 0) {
    mf.properties['mp-syndicate-to'] = JSON.parse(syndication);
  }
  return micropubApi('create', {
    param: mf,
  });
}

export function reply(url, content) {
  return micropubApi('create', {
    param: {
      type: ['h-entry'],
      properties: {
        'in-reply-to': [url],
        content: [content],
      },
    },
  });
}
