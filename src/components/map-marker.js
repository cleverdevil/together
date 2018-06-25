import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import AuthorAvatar from './author-avatar';
import TogetherCard from './card/index';

const markerSize = 18;

const styles = theme => ({
  marker: {
    width: markerSize,
    height: markerSize,
    marginTop: 0 - markerSize / 2,
    marginLeft: 0 - markerSize / 2,
    fontSize: markerSize - markerSize / 2,
    pointer: 'cursor',
    transition: 'transform .2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  popover: {
    padding: '13px 20px',
    maxWidth: 200,
  },
});

class MapMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postOpen: false,
      anchor: null,
    };
    this.handleClick = this.handleClick.bind(this);
    this.renderPost = this.renderPost.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({
      postOpen: true,
      anchor: e.target,
    });
  }

  renderPost() {
    if (!this.props.post) {
      return null;
    }
    return (
      <Popover
        open={this.state.postOpen}
        className={this.props.classes.popover}
        anchorEl={this.state.anchor}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        onClose={() => this.setState({ postOpen: false })}
        onBackdropClick={() => this.setState({ postOpen: false })}
      >
        <TogetherCard
          post={this.props.post}
          style={{ boxShadow: 'none', margin: 0 }}
          hideProperties={['checkin', 'location']}
        />
      </Popover>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className={this.props.classes.marker} onClick={this.handleClick}>
          <AuthorAvatar author={this.props.author} size={markerSize} />
        </div>
        {this.renderPost()}
      </React.Fragment>
    );
  }
}

MapMarker.defaultProps = {
  author: '?',
};

MapMarker.propTypes = {
  post: PropTypes.object,
  author: PropTypes.any.isRequired,
};

export default withStyles(styles)(MapMarker);
