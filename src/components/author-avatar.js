import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import authorToAvatarData from '../modules/author-to-avatar-data';

const AuthorAvatar = ({ author, size }) => {
  const avatarData = authorToAvatarData(author);
  let style = {
    background: avatarData.color,
  };
  if (size) {
    style.width = size;
    style.height = size;
  }
  return (
    <a
      href={avatarData.href}
      target="_blank"
      style={{ textDecoration: 'none' }}
    >
      <Avatar {...avatarData} aria-label={avatarData.alt} style={style}>
        {avatarData.src ? null : avatarData.initials}
      </Avatar>
    </a>
  );
};

AuthorAvatar.propTypes = {
  author: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  size: PropTypes.number,
};

export default AuthorAvatar;
