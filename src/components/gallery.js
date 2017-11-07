import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import Avatar from 'material-ui/Avatar';
import FullscreenPhoto from './fullscreen-photo';
import authorToAvatarData from '../modules/author-to-avatar-data';

const styles = theme => ({});

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPost: null,
      selectedPhoto: null,
    };
  }

  render() {
    const contentWidth = (document.getElementById('root').clientWidth - 49);
    const columnCount = Math.floor(contentWidth / 300)
    const cellHeight = Math.floor(contentWidth / columnCount);
    return (
      <div>
        <GridList cellHeight={cellHeight} cols={columnCount} spacing={0}>
          {this.props.posts.filter(post => post.photo).map(post => {
            const avatarData = authorToAvatarData(post.author);

            if (typeof post.photo === 'string') {
              post.photo = [post.photo];
            }
            return post.photo.map((photo) => (
              <GridListTile key={photo} cols={1} onClick={() => this.setState({selectedPhoto: photo, selectedPost: post})}>
                <img src={photo} alt="" />
                <GridListTileBar
                  title={post.name || (post.content && post.content.text) || ''}
                  subtitle={avatarData.alt}
                  actionIcon={
                    <Avatar
                      style={{marginRight: 14}}
                      {...avatarData}
                      aria-label={avatarData.alt}
                    >
                      {avatarData.src ? null : avatarData.initials}
                    </Avatar>
                  }
                />
              </GridListTile>
            ));
          })}
        </GridList>
        <FullscreenPhoto photo={this.state.selectedPhoto} post={this.state.selectedPost} />
      </div>
    );
  }
}

Gallery.defaultProps = {
  posts: [],
};

Gallery.propTypes = {
  posts: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(Gallery));