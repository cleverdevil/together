import resizeImage from './get-image-proxy-url';

function getDomain(string) {
  const url = new URL(string);
  let domain = url.hostname;
  if (domain.indexOf('www.') === 0) {
    domain = domain.slice(4);
  }
  return domain;
}

function stringToColor(string) {
  if (!string) {
    return '#000';
  }
  let hash = 0;
  for (var i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (var i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

export default function(author) {
  let avatar = {
    alt: 'Unknown',
    initials: '?',
  };
  if (author) {
    if (typeof author === 'string') {
      avatar.alt = author;
      avatar.href = author;
      if (avatar.alt.indexOf('http') === 0) {
        avatar.initials = getDomain(avatar.alt)[0].toUpperCase();
      } else {
        avatar.initials = avatar.alt[0].toUpperCase();
      }
    } else if (typeof author === 'object') {
      avatar.alt = author.name;
      avatar.src = author.photo;
      avatar.href = author.url;
      if (avatar.alt) {
        let initials = avatar.alt.match(/\b\w/g) || [];
        initials = (
          (initials.shift() || '') + (initials.pop() || '')
        ).toUpperCase();
        avatar.initials = initials;
      } else if (avatar.href) {
        avatar.alt = getDomain(avatar.href);
        avatar.initials = avatar.alt[0].toUpperCase();
      }
      if (avatar.src) {
        avatar.src = resizeImage(avatar.src, { w: 50, h: 50, t: 'square' });
      }
    }
  }
  avatar.color = stringToColor(avatar.href);
  return avatar;
}
