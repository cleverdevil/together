import React from 'react';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import Card from './card';
import Gallery from './gallery';

const styles = theme => ({
  timeline: {
    paddingLeft: 12,
    paddingRight: 12,
    maxWidth: 600,
  },
});

class Timeline extends React.Component {
  render() {
    let posts = this.props.items;
    if (this.props.postKind && this.props.postKind.filter) {
      posts = posts.filter(this.props.postKind.filter);
    }
    if (this.props.postKind && this.props.postKind.id && this.props.postKind.id === 'photo') {
      return (<Gallery posts={posts} />);
    } else {
      return (
        <div className={this.props.classes.timeline}>
          {posts.map((item, i) => (
            <Card post={item} key={'card-' + i} />
          ))}
        </div>
      );
    }
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
    postKind: state.postKinds.find(postKind => postKind.get('selected')).toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Timeline));
  