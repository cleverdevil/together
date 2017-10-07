import React from 'react';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Card from './card';


class Timeline extends React.Component {
  render() {
    let posts = this.props.items;
    if (this.props.postKindFilter) {
      posts = posts.filter(this.props.postKindFilter);
    }
    return (
      <div>
        {posts.map((item, i) => (
          <Card post={item} key={'card-' + i} />
        ))}
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
      items: state.timeline.toJS(),
      postKindFilter: state.postKinds.find(postKind => postKind.get('selected')).get('filter'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
  