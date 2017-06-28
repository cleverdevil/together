import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class CardFooter extends Component {
  render() {
    return (
      <div className="card__footer">
        {this.props.children}
      </div>
    );
  }
}

export default CardFooter;
