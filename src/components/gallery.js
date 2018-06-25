import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Button from '@material-ui/core/Button';
import ReactList from 'react-list';
import AuthorAvatar from './author-avatar';
import GallerySlider from './gallery-slider';
import { updatePost, decrementChannelUnread } from '../actions';
import authorToAvatarData from '../modules/author-to-avatar-data';
import getChannelSetting from '../modules/get-channel-setting';
import { posts as postsService } from '../modules/feathers-services';

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
    this.markPostRead = this.markPostRead.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleGallerySliderChange = this.handleGallerySliderChange.bind(this);
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

  markPostRead(postId) {
    this.props.updatePost(postId, '_is_read', true);
    postsService
      .update(postId, {
        channel: this.props.selectedChannel,
        method: 'mark_read',
      })
      .then(res =>
        this.props.decrementChannelUnread(this.props.selectedChannel),
      )
      .catch(err => this.props.updatePost(postId, '_is_read', false));
  }

  handleScroll() {
    const infiniteScrollEnabled = getChannelSetting(
      this.props.selectedChannel,
      'infiniteScroll',
      this.props.channelSettings,
    );
    const [
      firstVisibleIndex,
      lastVisibleIndex,
    ] = this.infiniteScroll.getVisibleRange();
    const scrollEl = this.infiniteScroll.scrollParent;
    if (
      infiniteScrollEnabled &&
      scrollEl.scrollTop > scrollEl.scrollHeight - scrollEl.clientHeight - 5
    ) {
      this.props.loadMore();
    }

    const autoReadEnabled = getChannelSetting(
      this.props.selectedChannel,
      'autoRead',
      this.props.channelSettings,
    );

    // This doesn't work with the ReactList type = simple
    // if (autoReadEnabled) {
    //   for (let i = firstVisibleIndex; i < lastVisibleIndex; i++) {
    //     const post = this.props.posts[i];
    //     if (!post._is_read) {
    //       this.markPostRead(post._id);
    //     }
    //   }
    // }
  }

  handleGallerySliderChange(post) {
    post = post.post;
    const autoReadEnabled = getChannelSetting(
      this.props.selectedChannel,
      'autoRead',
      this.props.channelSettings,
    );

    if (autoReadEnabled) {
      if (!post._is_read) {
        this.markPostRead(post._id);
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
        onClick={e => {
          this.setState({ selectedPhotoIndex: index });
          this.markPostRead(post._id);
        }}
        style={{ height: cellHeight, width: 100 / columnCount + '%' }}
      >
        <img src={photo} alt="" />
        <GridListTileBar
          title={post.name || (post.content && post.content.text) || ''}
          subtitle={avatarData.alt}
          actionIcon={
            <div style={{ marginRight: 14 }}>
              <AuthorAvatar author={post.author} />
            </div>
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
    const infiniteScrollEnabled = getChannelSetting(
      this.props.selectedChannel,
      'infiniteScroll',
      this.props.channelSettings,
    );

    if (infiniteScrollEnabled) {
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
            onChange={this.handleGallerySliderChange}
            onClose={() => this.setState({ selectedPhotoIndex: false })}
            onLastPhoto={() => {
              const infiniteScrollEnabled = getChannelSetting(
                this.props.selectedChannel,
                'infiniteScroll',
                this.props.channelSettings,
              );
              if (infiniteScrollEnabled) {
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
  return bindActionCreators(
    {
      decrementChannelUnread: decrementChannelUnread,
      updatePost: updatePost,
    },
    dispatch,
  );
}

function mapStateToProps(state, props) {
  return {
    selectedChannel: state.app.get('selectedChannel'),
    channelSettings: state.settings.get('channels'),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Gallery));
