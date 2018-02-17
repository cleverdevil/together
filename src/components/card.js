import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import Card, {
  CardHeader,
  CardActions,
  CardContent,
  CardMedia,
} from 'material-ui/Card';
import { GridList, GridListTile } from 'material-ui/GridList';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import DeveloperModeIcon from 'material-ui-icons/DeveloperMode';
import LikeIcon from 'material-ui-icons/ThumbUp';
import BookmarkIcon from 'material-ui-icons/Bookmark';
import ReplyIcon from 'material-ui-icons/Reply';
import RepostIcon from 'material-ui-icons/Repeat';
import VisitIcon from 'material-ui-icons/Link';
import ReadIcon from 'material-ui-icons/PanoramaFishEye';
import UnreadIcon from 'material-ui-icons/Lens';
import Popover from 'material-ui/Popover';
import SingleAvatarMap from './single-avatar-map';
import MicropubForm from './micropub-form';
import {
  addNotification,
  incrementChannelUnread,
  decrementChannelUnread,
  updatePost,
} from '../actions';
import moment from 'moment';
import authorToAvatarData from '../modules/author-to-avatar-data';
import * as indieActions from '../modules/indie-actions';
import microsub from '../modules/microsub-api';

const styles = theme => ({
  card: {
    marginTop: 12,
    marginBottom: 12,
    overflow: 'hidden',
    '& a': {
      color:
        theme.palette.type === 'dark'
          ? theme.palette.secondary.light
          : theme.palette.secondary.main,
    },
  },
  fullImage: {
    display: 'block',
    maxWidth: '100%',
    margin: '0 auto',
    height: 'auto',
  },
  map: {
    height: 200,
  },
  postContent: {
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
  },
  urlPreview: {
    background: theme.palette.action.disabledBackground,
  },
});

class TogetherCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      read: props.post._is_read,
      popoverOpen: false,
      popoverAnchor: null,
      bookmarkPopoverOpen: false,
      bookmarkPopoverAnchorL: null,
    };
    this.renderPhotos = this.renderPhotos.bind(this);
    this.renderLocation = this.renderLocation.bind(this);
    this.renderCheckin = this.renderCheckin.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.renderMedia = this.renderMedia.bind(this);
    this.renderUrl = this.renderUrl.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleRepost = this.handleRepost.bind(this);
    this.handleBookmark = this.handleBookmark.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleView = this.handleView.bind(this);
    this.handleToggleRead = this.handleToggleRead.bind(this);
  }

  handleLike(e) {
    const url = this.props.post.url;
    indieActions
      .like(url)
      .then(() => this.props.addNotification(`Successfully liked ${url}`))
      .catch(() => this.props.addNotification(`Error liking ${url}`, 'error'));
  }

  handleRepost(e) {
    const url = this.props.post.url;
    indieActions
      .repost(url)
      .then(() => this.props.addNotification(`Successfully reposted ${url}`))
      .catch(() =>
        this.props.addNotification(`Error reposting ${url}`, 'error'),
      );
  }

  handleReply(e) {
    const url = this.props.post.url;
    this.setState({
      inReplyToUrl: url,
      popoverOpen: true,
      popoverAnchor: e.target,
    });
  }
  
  handleReplySend(micropub) {
    indieActions
      .reply(
        micropub.properties['in-reply-to'][0],
        micropub.properties.content[0],
      )
      .then(() => {
        this.setState({ popoverOpen: false });
        this.props.addNotification(`Successfully posted reply`);
      })
      .catch(err => this.props.addNotification(`Error posting reply`, 'error'));
  }
  
  handleBookmark(e) {
    const url = this.props.post.url;
    const name = (this.props.post.name ? this.props.post.name : '');
    this.setState({
      bookmarkOfUrl: url,
      bookmarkOfName: name,
      bookmarkPopoverOpen: true,
      bookmarkPopoverAnchor: e.target
    });
  }
  
  handleBookmarkSend(micropub) {
    indieActions
      .bookmark(
        micropub.properties['bookmark-of'][0],
        micropub.properties['name'][0],
        micropub.properties.content[0],
      )
      .then(() => {
        this.setState({ bookmarkPopoverOpen: false });
        this.props.addNotification(`Successfully posted bookmark`);
      })
      .catch(err => this.props.addNotification(`Error posting bookmark`, 'error'));
  }

  handleView(e) {
    try {
      const url = this.props.post.url;
      const win = window.open(url, '_blank');
      win.focus();
    } catch (err) {
      this.props.addNotification(`Error opening url`, 'error');
    }
  }

  handleToggleRead(e) {
    this.setState(state => ({ read: !state.read }));
    if (this.state.read === false) {
      microsub('markRead', {
        params: [this.props.selectedChannel, this.props.post._id],
      })
        .then(res => {
          this.props.updatePost(this.props.post._id, '_is_read', true);
          this.props.decrementChannelUnread(this.props.selectedChannel);
          this.props.addNotification('Marked as read');
        })
        .catch(err => {
          console.log(err);
          this.props.addNotification('Error marking as read', 'error');
        });
    } else if (this.state.read === true) {
      microsub('markUnread', {
        params: [this.props.selectedChannel, this.props.post._id],
      })
        .then(res => {
          this.props.updatePost(this.props.post._id, '_is_read', false);
          this.props.incrementChannelUnread(this.props.selectedChannel);
          this.props.addNotification('Marked as unread');
        })
        .catch(err => {
          console.log(err);
          this.props.addNotification('Error marking as unread', 'error');
        });
    }
  }

  renderPhotos(photos) {
    if (!photos || this.props.embedMode === 'photo') {
      return null;
    }
    if (Array.isArray(photos) && photos.length === 1) {
      photos = photos[0];
    }
    if (typeof photos === 'string') {
      return (
        <img className={this.props.classes.fullImage} src={photos} alt="" />
      );
    } else if (Array.isArray(photos)) {
      let cols = photos.length > 3 ? 3 : photos.length;
      let cellHeight = 200;
      let cardWidth =
        document.getElementById('root').clientWidth - 49 - 12 - 12;
      if (cardWidth < 600) {
        cellHeight = Math.floor(cardWidth / 3);
      }
      return (
        <GridList cellHeight={cellHeight} cols={cols} spacing={0}>
          {photos.map(photo => (
            <GridListTile key={photo} cols={1}>
              <img src={photo} alt="" />
            </GridListTile>
          ))}
        </GridList>
      );
    }
    return null;
  }

  renderUrl(urls, type) {
    if (!urls) {
      return null;
    }
    let introText = '';
    switch (type) {
      case 'reply':
        introText = <ReplyIcon style={{margin: '0 10px -5px 0', width: '18px', height: '18px'}} />;
        break;
      case 'like':
        introText = <LikeIcon style={{margin: '0 10px -5px 0', width: '18px', height: '18px'}} />;
        break;
      case 'repost':
        introText = <RepostIcon style={{margin: '0 10px -5px 0', width: '18px', height: '18px'}} />;
        break;
      case 'bookmark':
        introText = <BookmarkIcon style={{margin: '0 10px -5px 0', width: '18px', height: '18px'}} />;
        break;
    }
    return urls.map((url, i) => (
      <CardContent
        key={'card-urls-' + i}
        className={this.props.classes.urlPreview}
      >
        <Typography component="p">
          {introText}
          <a href={url} target="_blank">
            {url}
          </a>
        </Typography>
      </CardContent>
    ));
  }

  renderMedia(media, type) {
    if (typeof media === 'string') {
      return <CardMedia component={type} src={media} />;
    }
    return null;
  }

  renderCheckin(location, author) {
    if (this.props.embedMode === 'marker') {
      return null;
    }

    let lat = false;
    let lng = false;
    if (!location) {
      return null;
    }
    if (location.latitude && location.longitude) {
      lat = parseFloat(location.latitude);
      lng = parseFloat(location.longitude);
    }

    if (lat !== false && lng !== false) {
      return <SingleAvatarMap lat={lat} lng={lng} author={author} />;
    }

    return null;
  }

  renderLocation(location) {
    if (!location) {
      return null;
    }

    if (location.name !== undefined) {
      return <CardContent>{location.name}</CardContent>;
    }

    return null;
  }

  renderContent() {
    const item = this.props.post;
    let title = null;
    let summary = null;
    let content = null;

    if (item.name) {
      title = (
        <Typography
          variant="headline"
          component="h2"
          dangerouslySetInnerHTML={{ __html: item.name }}
        />
      );
    }

    if (item.summary && !item.content) {
      summary = (
        <Typography
          component="p"
          dangerouslySetInnerHTML={{ __html: item.summary }}
        />
      );
    }

    if (item.content) {
      const contentObject = item.content;
      if (contentObject.html) {
        content = (
          <Typography
            component="div"
            className={this.props.classes.postContent}
            dangerouslySetInnerHTML={{ __html: contentObject.html }}
          />
        );
      } else if (contentObject.value) {
        content = (
          <Typography
            component="p"
            dangerouslySetInnerHTML={{ __html: contentObject.value }}
          />
        );
      } else if (contentObject.text) {
        content = (
          <Typography
            component="p"
            dangerouslySetInnerHTML={{ __html: contentObject.text }}
          />
        );
      }
    }
    return (
      <CardContent>
        {title}
        {summary}
        {content}
      </CardContent>
    );
  }

  render() {
    const item = this.props.post;

    // Parse author data
    const avatarData = authorToAvatarData(item.author);

    // Parse published date
    let date = 'unknown';
    if (item.published) {
      date = moment(item.published).fromNow();
    }

    let cardStyle = {};
    if (
      this.props.embedMode === 'photo' ||
      this.props.embedMode === 'classic'
    ) {
      cardStyle.boxShadow = 'none';
    }
    if (this.props.embedMode === 'marker') {
      cardStyle.padding = 10;
    }
    if (this.props.embedMode === 'classic') {
      cardStyle.margin = 0;
      cardStyle.minHeight = '100%';
      cardStyle.maxWidth = 700;
    }

    let authorNameLink = <a href={avatarData.href} target="_blank">{avatarData.alt}</a>

    return (
      <Card className={this.props.classes.card} style={cardStyle}>
        <CardHeader
          title={authorNameLink}
          subheader={date}
          avatar={
            <a href={avatarData.href} target="_blank">
              <Avatar
                {...avatarData}
                aria-label={avatarData.alt}
                style={{ background: avatarData.color }}
              >
                {avatarData.src ? null : avatarData.initials}
              </Avatar>
            </a>
          }
        />
        {this.renderUrl(item['in-reply-to'], 'reply')}
        {this.renderUrl(item['like-of'], 'like')}
        {this.renderUrl(item['repost-of'], 'repost')}
        {this.renderUrl(item['bookmark-of'], 'bookmark')}
        {this.renderMedia(item.video, 'video')}
        {this.renderMedia(item.audio, 'audio')}
        {this.renderPhotos(item.featured)}
        {this.renderPhotos(item.photo)}

        {this.renderContent()}

        {this.renderLocation(item.location)}
        {this.renderCheckin(item.checkin, item.author)}

        <CardActions>
          <Tooltip title="Like" placement="top">
            <IconButton onClick={this.handleLike}>
              <LikeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Repost" placement="top">
            <IconButton onClick={this.handleRepost}>
              <RepostIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bookmark" placement="top">
            <IconButton onClick={this.handleBookmark}>
              <BookmarkIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reply" placement="top">
            <IconButton onClick={this.handleReply}>
              <ReplyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={'Mark as ' + (this.state.read ? 'Unread' : 'Read')}
            placement="top"
          >
            <IconButton onClick={this.handleToggleRead}>
              {this.state.read ? <ReadIcon /> : <UnreadIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="View Original" placement="top">
            <IconButton onClick={this.handleView}>
              <VisitIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Log to console" placement="top">
            <IconButton onClick={() => console.log(item)} aria-label="Log">
              <DeveloperModeIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
        <Popover
          open={this.state.popoverOpen}
          anchorEl={this.state.popoverAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={() => this.setState({ popoverOpen: false })}
          onBackdropClick={() => this.setState({ popoverOpen: false })}
        >
          <div
            style={{
              padding: 10,
            }}
          >
            <MicropubForm
              onSubmit={this.handleReplySend}
              in-reply-to={this.state.inReplyToUrl}
            />
          </div>
        </Popover>
        <Popover
          open={this.state.bookmarkPopoverOpen}
          anchorEl={this.state.bookmarkPopoverAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={() => this.setState({ bookmarkPopoverOpen: false })}
          onBackdropClick={() => this.setState({ bookmarkPopoverOpen: false })}
        >
          <div
            style={{
              padding: 10,
            }}
          >
            <MicropubForm
              onSubmit={this.handleBookmarkSend}
              bookmark-of={this.state.bookmarkOfUrl}
              name={this.bookmarkOfName}
              shownFields={['name', 'content']}
            />
          </div>
        </Popover>
      </Card>
    );
  }
}

TogetherCard.defaultProps = {
  post: {},
  embedMode: '',
};

TogetherCard.propTypes = {
  post: PropTypes.object.isRequired,
  embedMode: PropTypes.string,
};

function mapStateToProps(state, props) {
  return {
    selectedChannel: state.app.get('selectedChannel'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addNotification: addNotification,
      decrementChannelUnread: decrementChannelUnread,
      incrementChannelUnread: incrementChannelUnread,
      updatePost: updatePost,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(TogetherCard),
);
