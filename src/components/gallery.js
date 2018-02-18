import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import GallerySlider from './gallery-slider';
import authorToAvatarData from '../modules/author-to-avatar-data';

const styles = theme => ({
  loadMore: {
    width: '100%',
    marginTop: 16,
  },
});

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPhotoIndex: false,
    };
  }

  render() {
    const contentWidth = document.getElementById('root').clientWidth - 49;
    const columnCount = Math.floor(contentWidth / 300);
    const cellHeight = Math.floor(contentWidth / columnCount);
    let index = -1;
    return (
      <div>
        <GridList cellHeight={cellHeight} cols={columnCount} spacing={0}>
          {this.props.posts.filter(post => post.photo).map(post => {
            const avatarData = authorToAvatarData(post.author);

            if (typeof post.photo === 'string') {
              post.photo = [post.photo];
            }
            return post.photo.map(photo => {
              index++;
              const photoIndex = index;
              return (
                <GridListTile
                  key={photo}
                  cols={1}
                  onClick={e =>
                    this.setState({ selectedPhotoIndex: photoIndex })
                  }
                >
                  <img src={photo} alt="" />
                  <GridListTileBar
                    title={
                      post.name || (post.content && post.content.text) || ''
                    }
                    subtitle={avatarData.alt}
                    actionIcon={
                      <Avatar
                        style={{
                          marginRight: 14,
                          background: avatarData.color,
                        }}
                        {...avatarData}
                        aria-label={avatarData.alt}
                      >
                        {avatarData.src ? null : avatarData.initials}
                      </Avatar>
                    }
                  />
                </GridListTile>
              );
            });
          })}
        </GridList>
        {this.state.selectedPhotoIndex !== false && (
          <GallerySlider
            posts={this.props.posts}
            startIndex={this.state.selectedPhotoIndex}
            onClose={() => this.setState({ selectedPhotoIndex: false })}
            open={true}
          />
        )}
        {this.props.loadMore && (
          <Button
            onClick={this.props.loadMore}
            className={this.props.classes.loadMore}
          >
            Load More
          </Button>
        )}
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
  return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(Gallery));
