import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class CardHeader extends Component {
  render() {
    return (
      <div className="card__header">
        {this.props.children}
      </div>
    );
  }
}

export default CardHeader;
