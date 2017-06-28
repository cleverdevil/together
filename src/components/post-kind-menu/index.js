import React from 'react';
// import PropTypes from 'prop-types';
import './PostKindMenu.css';


class PostKindMenu extends React.Component {
  render() {
    const postKinds = [
      {
        id: 'note',
        name: 'Notes',
        icon: '💬',
      },
      {
        id: 'photo',
        name: 'Photos',
        icon: '📷',
      },
      {
        id: 'post',
        name: 'Articles',
        icon: '📝',
      },
      {
        id: 'audio',
        name: 'Podcasts & Music',
        icon: '🎧',
      },
      {
        id: 'checkins',
        name: 'Checkins',
        icon: '📌',
      },
    ];
    return (
      <nav className="post-kind-menu">
        {postKinds.map((postKind) => (
          <button key={'post-kind-menu-' + postKind.id} title={postKind.name} className="post-kind-menu__post-kind">{postKind.icon}</button>
        ))}
      </nav>
    );
  }
}

PostKindMenu.defaultProps = {};

PostKindMenu.propTypes = {};

export default PostKindMenu;
