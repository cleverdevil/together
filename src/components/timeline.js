import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import Card from './card';

import {} from '../actions';

const styles = theme => ({
  timeline: {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: 600,
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
  },
});

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={this.props.classes.timeline}>
        {this.props.posts.map((item, i) => (
          <Card post={item} key={'card-' + i} />
        ))}
        {this.props.timelineAfter ? (
          <Button onClick={this.props.loadMore}>Load More</Button>
        ) : null}
      </div>
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
    timelineAfter: state.app.get('timelineAfter'),
    items: state.posts.toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Timeline),
);
