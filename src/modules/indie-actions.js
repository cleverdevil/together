import micropubApi from './micropub-api';

export function like(url) {
  return micropubApi('create', {
    param: {
      type: ['h-entry'],
      properties: {
        'like-of': [url],
      },
    },
  });
}

export function repost(url) {
  return micropubApi('create', {
    param: {
      type: ['h-entry'],
      properties: {
        'repost-of': [url],
      },
    },
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