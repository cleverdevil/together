import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CardAuthor.css';

class CardAuthor extends Component {
  render() {
    return (
      <a className="card__author" href={this.props.url}>
        <img src={this.props.photo} alt="" />
        {this.props.name}
      </a>
    );
  }
}

CardAuthor.defaultProps = {
  url: '#',
  name: 'unknown',
  photo: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
}

CardAuthor.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
};

export default CardAuthor;
