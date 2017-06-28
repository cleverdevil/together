import React from 'react';
import PropTypes from 'prop-types';
import './CardTitle.css';

const CardTitle = (props) => {
  return (
    <h1 className="card__title">{props.title}</h1>
  );
};

CardTitle.defaultProps = {
};

CardTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default CardTitle;
