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
import { Map, Marker, TileLayer } from 'react-leaflet';
import MicropubForm from './micropub-form';
import moment from 'moment';
import authorToAvatarData from '../modules/author-to-avatar-data';
import * as indieActions from '../modules/indie-actions';
import 'leaflet/dist/leaflet.css';

// Hack to fix leaflet marker
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
// End hacky times

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
    this.handleLike = this.handleLike.bind(this);
    this.handleRepost = this.handleRepost.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleView = this.handleView.bind(this);
  }

  handleLike(e) {
    const url = this.props.post.url;
    indieActions.like(url)
      .then(() => alert('successful like'))
      .catch(() => alert('error liking'));
  }

  handleRepost(e) {
    const url = this.props.post.url;
    indieActions.repost(url)
      .then(() => alert('successful repost'))
      .catch(() => alert('error repost'));
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
        alert('successful reply');
      })
      .catch((err) => console.log('Error posting reply'));
  }

  handleView(e) {
    try {
      const url = this.props.post.url;
      const win = window.open(url, '_blank');
      win.focus();
    } catch (err) {
      console.log(err);
    }
  }

  renderPhotos(photos) {
    if (!photos || this.props.embedMode === 'photo') {
      return null;
    }
    if (typeof photos === 'string') {
      return (
        <img
          className={this.props.classes.fullImage}  
          src={photos}
        />
      );
    } else if (Array.isArray(photos)) {
      let cellHeight = 200;
      let cardWidth = (document.getElementById('root').clientWidth - 49 - 12 - 12);
      if (cardWidth < 600) {
        cellHeight = Math.floor(cardWidth / 3);
      }
      return (
        <GridList cellHeight={cellHeight} cols={3} spacing={0}>
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

  renderCheckin(location) {
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
        <Map
          center={[lat, lng]}
          zoom={14}
          scrollWheelZoom={false}
          className={this.props.classes.map}
          >
          <TileLayer
            url='https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'
            attribution='Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={18}
          />
          <Marker position={[lat,lng]}></Marker>
        </Map>
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
      title = (<Typography type="headline" component="h2">{item.name}</Typography>);
    }

    if (item.summary && !item.content) {
      summary = (<Typography component="p">{item.summary}</Typography>);
    }

    if (item.content) {
      const contentObject = item.content; 
      if (contentObject.html) {
        content = (<Typography component="div" className={this.props.classes.postContent} dangerouslySetInnerHTML={{__html: contentObject.html}}></Typography>);
      } else if (contentObject.value) {
        content = (<Typography component="p">{contentObject.value}</Typography>);
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
        {this.renderMedia(item.video, 'video')}
        {this.renderMedia(item.audio, 'audio')}
        {this.renderPhotos(item.featured)}
        {this.renderPhotos(item.photo)}

        {this.renderContent()}

        {this.renderLocation(item.location)}
        {this.renderCheckin(item.checkin)}

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

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({

//   }, dispatch);
// }

// export default connect(null, mapDispatchToProps)(withStyles(styles)(TogetherCard));
export default withStyles(styles)(TogetherCard);
