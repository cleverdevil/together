import React from 'react';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Card from './card';


class Timeline extends React.Component {
  render() {
    return (
      <Grid container direction="column">
        {this.props.items.map((item, i) => (
          <Card post={item} key={'card-' + i} />
        ))}
      </Grid>
    );
  }
}
  
Timeline.defaultProps = {
  items: [],
};

Timeline.propTypes = {
  items: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  return {
      items: state.timeline.toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
  