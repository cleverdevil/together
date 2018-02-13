import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import Popover from 'material-ui/Popover';
import Avatar from 'material-ui/Avatar';
import authorToAvatarData from '../modules/author-to-avatar-data';
import TogetherCard from './card';

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
        <TogetherCard post={this.props.post} embedMode="marker" />
      </Popover>
    );
  }

  render() {
    const avatarData = authorToAvatarData(this.props.author);
    return (
      <div>
        <Avatar
          className={this.props.classes.marker}
          {...avatarData}
          style={{ background: avatarData.color }}
          aria-label={avatarData.alt}
          onClick={this.handleClick}
        >
          {avatarData.src ? null : avatarData.initials}
        </Avatar>
        {this.renderPost()}
      </div>
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(MapMarker));
