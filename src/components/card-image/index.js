import React from 'react';
import PropTypes from 'prop-types';
import './CardImage.css';

const CardImage = (props) => {
  return (
    <img className="card__image" src={props.src} alt={props.alt} />
  );
};

CardImage.defaultProps = {
  alt: '',  
};

CardImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,  
};

export default CardImage;
