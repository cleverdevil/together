import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card';
import { GridList, GridListTile } from 'material-ui/GridList';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import DeveloperModeIcon from 'material-ui-icons/DeveloperMode';
import LikeIcon from 'material-ui-icons/ThumbUp';
import ReplyIcon from 'material-ui-icons/Reply';
import RepostIcon from 'material-ui-icons/Repeat';
import VisitIcon from 'material-ui-icons/Link';
import Popover from 'material-ui/Popover';
import ReactMapGL, {Marker} from 'react-map-gl';
import SingleAvatarMap from './single-avatar-map';
import MicropubForm from './micropub-form';
import { addNotification } from '../actions';
import moment from 'moment';
import authorToAvatarData from '../modules/author-to-avatar-data';
import * as indieActions from '../modules/indie-actions';

const styles = theme => ({
  card: {
    marginTop: 12,
    marginBottom: 12,
    overflow: 'hidden',
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
    }
  }
});

class TogetherCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
      popoverAnchor: null,
    };
    this.renderPhotos = this.renderPhotos.bind(this);
    this.renderLocation = this.renderLocation.bind(this);
    this.renderCheckin = this.renderCheckin.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.renderMedia = this.renderMedia.bind(this);
    this.renderUrl = this.renderUrl.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleRepost = this.handleRepost.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleView = this.handleView.bind(this);
  }

  handleLike(e) {
    const url = this.props.post.url;
    indieActions.like(url)
      .then(() => this.props.addNotification(`Successfully liked ${url}`))
      .catch(() => this.props.addNotification(`Error liking ${url}`, 'error'));
  }

  handleRepost(e) {
    const url = this.props.post.url;
    indieActions.repost(url)
      .then(() => this.props.addNotification(`Successfully reposted ${url}`))
      .catch(() => this.props.addNotification(`Error reposting ${url}`, 'error'));
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
    indieActions.reply(micropub.properties['in-reply-to'][0], micropub.properties.content[0])
      .then(() => {
        this.setState({ popoverOpen: false });
        this.props.addNotification(`Successfully posted reply`)
      })
      .catch((err) => this.props.addNotification(`Error posting reply`, 'error'));
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

  renderPhotos(photos) {
    if (!photos || this.props.embedMode === 'photo') {
      return null;
    }
    if (Array.isArray(photos) && photos.length === 1) {
      photos = photos[0];
    }
    if (typeof photos === 'string') {
      return (
        <img
          className={this.props.classes.fullImage}  
          src={photos}
        />
      );
    } else if (Array.isArray(photos)) {
      let cols = photos.length > 3 ? 3 : photos.length;
      let cellHeight = 200;
      let cardWidth = (document.getElementById('root').clientWidth - 49 - 12 - 12);
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
        introText = 'In reply to ';
        break;
      case 'like':
        introText = 'Like of ';
        break;
      case 'repost':
        introText = 'Repost of ';
        break;
    }
    return urls.map((url) => (
      <CardContent>
        <Typography component="p">
          {introText}
          <a href={url} target="_blank">{url}</a>
        </Typography>
      </CardContent>
    ));
  }

  renderMedia(media, type) {
    if (typeof media === 'string') {
      return (
        <CardMedia
          component={type}
          src={media}
        />
      );
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
      return (
        <SingleAvatarMap lat={lat} lng={lng} author={author} />
      );
    }

    return null;
  }

  renderLocation(location) {
    if (!location) {
      return null;
    }

    if (location.name !== undefined) {
      return (<CardContent>{location.name}</CardContent>);
    }

    return null;
  }

  renderContent() {
    const item = this.props.post;
    let title = null;
    let summary = null;
    let content = null;
    
    if (item.name) {
      title = (<Typography type="headline" component="h2" dangerouslySetInnerHTML={{__html: item.name}}></Typography>);
    }

    if (item.summary && !item.content) {
      summary = (<Typography component="p" dangerouslySetInnerHTML={{__html: item.summary}}></Typography>);
    }

    if (item.content) {
      const contentObject = item.content; 
      if (contentObject.html) {
        content = (<Typography component="div" className={this.props.classes.postContent} dangerouslySetInnerHTML={{__html: contentObject.html}}></Typography>);
      } else if (contentObject.value) {
        content = (<Typography component="p" dangerouslySetInnerHTML={{__html: contentObject.value}}></Typography>);
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
    if (this.props.embedMode === 'photo' || this.props.embedMode === 'marker') {
      cardStyle.boxShadow = 'none';
    }
    if (this.props.embedMode === 'marker') {
      cardStyle.margin = '-13px -20px';
      cardStyle.background = 'none';
    }

    return (
      <Card className={this.props.classes.card} style={cardStyle}>
        <CardHeader
          title={avatarData.alt}
          subheader={date}
          avatar={
            <Avatar
              {...avatarData}
              aria-label={avatarData.alt}
            >
              {avatarData.src ? null : avatarData.initials}
            </Avatar>
          }
        />
        {this.renderUrl(item['in-reply-to'], 'reply')}
        {this.renderUrl(item['like-of'], 'like')}
        {this.renderUrl(item['repost-of'], 'repost')}
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
          <Tooltip title="Reply" placement="top">
            <IconButton onClick={this.handleReply}>
              <ReplyIcon />
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
          onBackdropClick={() => this.setState({popoverOpen: false})}
        >
          <div style={{
            padding: 10,
          }}>
          <MicropubForm
            onSubmit={this.handleReplySend}
            in-reply-to={this.state.inReplyToUrl}
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addNotification: addNotification,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(TogetherCard));
