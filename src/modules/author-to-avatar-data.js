export default function (author) {
  let avatar = {
    alt: 'Unknown',
    initials: '?',
  };
  if (author) {
    if (typeof author === 'string') {
      avatar.alt = author;
      avatar.href = author;
      if (avatar.alt.indexOf('http') === 0) {
        avatar.initials = avatar.alt.replace('http://', '').replace('https://', '')[0].toUpperCase();
      } else {
        avatar.initials = avatar.alt[0].toUpperCase();
      }
    } else if (typeof author === 'object') {
      avatar.alt = author.name;
      avatar.src = author.photo;
      avatar.href = author.url;
      if (author.alt) {
        let initials = avatar.alt.match(/\b\w/g) || [];
        initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
        avatar.initials = initials;
      }
    }
  }
  return avatar;
}