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
import { Map, Marker, TileLayer } from 'react-leaflet';
import moment from 'moment';
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
    this.renderPhotos = this.renderPhotos.bind(this);
    this.renderLocation = this.renderLocation.bind(this);
    this.renderCheckin = this.renderCheckin.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.renderMedia = this.renderMedia.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleRepost = this.handleRepost.bind(this);
    this.handleReply = this.handleReply.bind(this);
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

  renderPhotos(photos) {
    if (!photos) {
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
    let author = {
      name: 'Unknown',
      photo: null,
      url: null,
    };
    if (item.author) {
      if (typeof item.author === 'string') {
        author.name = item.author;
        author.url = item.author;
      } else if (typeof item.author === 'object') {
        author.name = item.author.name;
        author.photo = item.author.photo;
        author.url = item.author.url;
      }
    }

    // Parse published date
    let date = 'unknown';
    if (item.published) {
      date = moment(item.published).fromNow();
    }
    return (
      <Card className={this.props.classes.card}>
        <CardHeader
          title={author.name}
          subheader={date}
          avatar={
            <Avatar
              aria-label={author.name}
              alt={author.name}
              src={author.photo}
            />
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
          <Tooltip title="Log to console" placement="top">
            <IconButton onClick={() => console.log(item)} aria-label="Log">
              <DeveloperModeIcon />
            </IconButton>
          </Tooltip>  
        </CardActions>
      </Card>
    );
  }
}
  
TogetherCard.defaultProps = {
  post: [],
};

TogetherCard.propTypes = {
  post: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(TogetherCard));
  