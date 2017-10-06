import React from 'react';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Card from './card';


class Timeline extends React.Component {
  render() {
    let posts = this.props.items;
    if (this.props.postKindFilter) {
      posts = posts.filter(this.props.postKindFilter);
    }
    return (
      <Grid container direction="column">
        {posts.map((item, i) => (
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
      postKindFilter: state.postKinds.find(postKind => postKind.get('selected')).get('filter'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
  