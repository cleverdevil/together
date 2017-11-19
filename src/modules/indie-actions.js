import micropubApi from './micropub-api';

export function like(url, syndication = []) {
  let mf = {
    type: ['h-entry'],
    properties: {
      'like-of': [url],
    },
  };
  if (syndication.length > 0) {
    mf.properties['mp-syndicate-to'] = syndication;
  }
  return micropubApi('create', {
    param: mf,
  });
}

export function repost(url, syndication = []) {
  let mf = {
    type: ['h-entry'],
    properties: {
      'repost-of': [url],
    },
  };
  if (syndication.length > 0) {
    mf.properties['mp-syndicate-to'] = syndication;
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
      }
    },
  });
}