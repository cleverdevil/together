import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import ReactList from 'react-list';
import GallerySlider from './gallery-slider';
import authorToAvatarData from '../modules/author-to-avatar-data';
import { Divider } from 'material-ui';

const styles = theme => ({
  galleryWrapper: {
    overflow: 'auto',
    height: '100%',
  },
  loadMore: {
    width: '100%',
    marginTop: 16,
  },
});

const contentWidth = document.getElementById('root').clientWidth - 49;
const columnCount = Math.floor(contentWidth / 300);
const cellHeight = Math.floor(contentWidth / columnCount);

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      selectedPhotoIndex: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderGallery = this.renderGallery.bind(this);
    this.renderLoadMore = this.renderLoadMore.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.posts && newProps.posts != this.props.posts) {
      const photoPosts = newProps.posts.filter(post => post.photo);
      const photos = [];
      photoPosts.forEach(post => {
        if (typeof post.photo === 'string') {
          post.photo = [post.photo];
        }
        post.photo.forEach(photo =>
          photos.push({
            photo: photo,
            post: post,
          }),
        );
      });
      if (photos.length != this.state.photos.length) {
        this.setState({ photos: photos });
      }
    }
  }

  handleScroll() {
    const selectedChannel = this.props.channels.find(
      channel => channel.uid == this.props.selectedChannel,
    );
    const [
      firstVisibleIndex,
      lastVisibleIndex,
    ] = this.infiniteScroll.getVisibleRange();
    const scrollEl = this.infiniteScroll.scrollParent;
    if (
      scrollEl.scrollTop >
      scrollEl.scrollHeight - scrollEl.clientHeight - 5
    ) {
      if (selectedChannel && selectedChannel.infiniteScroll) {
        this.props.loadMore();
      }
    }

    for (let i = firstVisibleIndex; i < lastVisibleIndex; i++) {
      const post = this.props.posts[i];
      if (!post._is_read) {
        if (selectedChannel && selectedChannel.autoRead) {
          console.log(post);
          // TODO: Mark this post as read if the setting is enabled
        }
      }
    }
  }

  renderItem(index, key) {
    const post = this.state.photos[index].post;
    const photo = this.state.photos[index].photo;
    const avatarData = authorToAvatarData(post.author);
    return (
      <GridListTile
        key={key}
        cols={1}
        onClick={e => this.setState({ selectedPhotoIndex: index })}
        style={{ height: cellHeight, width: 100 / columnCount + '%' }}
      >
        <img src={photo} alt="" />
        <GridListTileBar
          title={post.name || (post.content && post.content.text) || ''}
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
  }

  renderGallery(items, ref) {
    return (
      <div ref={ref}>
        <GridList cellHeight={cellHeight} cols={columnCount} spacing={0}>
          {items}
        </GridList>
      </div>
    );
  }

  renderLoadMore() {
    const selectedChannel = this.props.channels.find(
      channel => channel.uid == this.props.selectedChannel,
    );
    if (selectedChannel && selectedChannel.infiniteScroll) {
      return null;
    }
    if (this.props.loadMore) {
      return (
        <Button
          className={this.props.classes.loadMore}
          onClick={this.props.loadMore}
        >
          Load More
        </Button>
      );
    }
    return null;
  }

  render() {
    return (
      <React.Fragment>
        <div
          className={this.props.classes.galleryWrapper}
          onScroll={this.handleScroll}
        >
          <ReactList
            itemRenderer={this.renderItem}
            itemsRenderer={this.renderGallery}
            length={this.state.photos.length}
            type="simple"
            ref={el => {
              this.infiniteScroll = el;
            }}
          />
          {this.renderLoadMore()}
        </div>

        {this.state.selectedPhotoIndex !== false && (
          <GallerySlider
            posts={this.props.posts}
            startIndex={this.state.selectedPhotoIndex}
            onClose={() => this.setState({ selectedPhotoIndex: false })}
            onLastPhoto={() => {
              const selectedChannel = this.props.channels.find(
                channel => channel.uid == this.props.selectedChannel,
              );
              if (selectedChannel && selectedChannel.infiniteScroll) {
                this.props.loadMore();
              }
            }}
            open={true}
          />
        )}
      </React.Fragment>
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

function mapStateToProps(state, props) {
  return {
    selectedChannel: state.app.get('selectedChannel'),
    channels: state.channels.toJS(),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Gallery),
);
