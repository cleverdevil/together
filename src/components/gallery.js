import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
// import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
// import Typography from 'material-ui/Typography';
// import LikeIcon from 'material-ui-icons/ThumbUp';
// import ReplyIcon from 'material-ui-icons/Reply';
// import RepostIcon from 'material-ui-icons/Repeat';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
// import moment from 'moment';

const styles = theme => ({
  popup: {
    display: 'flex',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    background: theme.palette.shades.dark.background.appBar,
  },
  popupImage: {
    display: 'block',
    margin: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    boxShadow: '0 0 3em rgba(0,0,0,.5)',
  },
  popupClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'white',
    background: 'rgba(0,0,0,.5)',
    borderRadius: 0,
  }
});

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPost: null,
      selectedPhoto: null,
    };
    this.renderPopup = this.renderPopup.bind(this);
  }

  handleLike(e) {
    try {
      const url = this.props.post.url;
      const likeUrl = 'https://quill.p3k.io/favorite?url=' + encodeURIComponent(url);
      const win = window.open(likeUrl, '_blank');
      win.focus();
    } catch (err) {
      alert('Error liking post');
      console.log(err);
    }
  }

  handleRepost(e) {
    try {
      const url = this.props.post.url;
      const likeUrl = 'https://quill.p3k.io/repost?url=' + encodeURIComponent(url);
      const win = window.open(likeUrl, '_blank');
      win.focus();
    } catch (err) {
      alert('Error reposting');
      console.log(err);
    }
  }

  handleReply(e) {
    try {
      const url = this.props.post.url;
      const likeUrl = 'https://quill.p3k.io/new?reply=' + encodeURIComponent(url);
      const win = window.open(likeUrl, '_blank');
      win.focus();
    } catch (err) {
      alert('Error replying');
      console.log(err);
    }
  }

  renderPopup() {
    let open = false;
    let content = null;
    if (this.state.selectedPost && this.state.selectedPhoto) {
      open = true;
      const post = this.state.selectedPost;
      const photo = this.state.selectedPhoto;
      content = (
        <div className={this.props.classes.popup}>
          <IconButton className={this.props.classes.popupClose} onClick={() => this.setState({ selectedPhoto: null })}>
            <CloseIcon />  
          </IconButton>  
          <img className={this.props.classes.popupImage} src={photo} alt="" />
        </div>
      );
    }
    return (
      <Dialog
        fullScreen
        open={open}
        onRequestClose={() => this.setState({selectedPhoto: null})}
        transition={<Slide direction="up" />}
      >
        {content}
      </Dialog>
    );
  }

  render() {
    const contentWidth = (document.getElementById('root').clientWidth - 49);
    const columnCount = Math.floor(contentWidth / 300)
    const cellHeight = Math.floor(contentWidth / columnCount);
    return (
      <div>
        <GridList cellHeight={cellHeight} cols={columnCount} spacing={0}>
          {this.props.posts.filter(post => post.photo).map(post => {
            // Parse author data
            let author = {
              name: 'Unknown',
              photo: null,
              url: null,
            };
            if (post.author) {
              if (typeof post.author === 'string') {
                author.name = post.author;
                author.url = post.author;
              } else if (typeof post.author === 'object') {
                author.name = post.author.name;
                author.photo = post.author.photo;
                author.url = post.author.url;
              }
            }
            if (typeof post.photo === 'string') {
              post.photo = [post.photo];
            }
            return post.photo.map((photo) => (
              <GridListTile key={photo} cols={1} onClick={() => this.setState({selectedPhoto: photo, selectedPost: post})}>
                <img src={photo} alt="" />
                <GridListTileBar
                  title={post.name || (post.content && post.content.text) || ''}
                  subtitle={author.name}
                  actionIcon={
                    <Avatar
                      aria-label={author.name}
                      alt={author.name}
                      src={author.photo}
                      style={{marginRight: 14}}
                    />
                  }
                />
              </GridListTile>
            ));
          })}
        </GridList>
        {this.renderPopup()}
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