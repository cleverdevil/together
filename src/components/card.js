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
  }
});

class TogetherCard extends React.Component {
  constructor(props) {
    super(props);
    this.renderPhotos = this.renderPhotos.bind(this);
    this.renderLocation = this.renderLocation.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleRepost = this.handleRepost.bind(this);
    this.handleReply = this.handleReply.bind(this);
  }

  handleLike(e) {
    try {
      const url = this.props.post.properties.url[0];
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
      const url = this.props.post.properties.url[0];
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
      const url = this.props.post.properties.url[0];
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
    if (photos.length === 1) {
      return (
        <img
          className={this.props.classes.fullImage}  
          src={photos[0]}
        />
      );
    } else if (photos.length > 1) {
      return (
        <GridList cellHeight={160} cols={3}>
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

  renderLocation(locations) {
    let lat = null;
    let lng = null;
    if (!locations) {
      return null;
    }
    return locations.map((location, i) => {
      if (location.properties && location.properties.latitude && location.properties.latitude[0] && location.properties.longitude && location.properties.longitude[0]) {
        lat = location.properties.latitude[0];
        lng = location.properties.longitude[0];
      }

      if (lat && lng) {
        return (
          <Map
            center={[lat, lng]}
            zoom={14}
            scrollWheelZoom={false}
            className={this.props.classes.map} key={'card-map-' + i}
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
    });
  }

  render() {
    const item = this.props.post;

    // Parse author data
    let author = {
      name: 'Unknown',
      photo: null,
      url: null,
    };
    if (item.properties.author && item.properties.author[0]) {
      if (typeof item.properties.author[0] == 'string') {
        author.name = item.properties.author[0];
        author.url = item.properties.author[0];
      } else if (item.properties.author[0].properties) {
        author.name = item.properties.author[0].properties.name;
        author.photo = item.properties.author[0].properties.photo;
        author.url = item.properties.author[0].properties.url;
      }
    }

    // Parse published date
    let date = 'unknown';
    if (item.properties.published && item.properties.published[0]) {
      date = moment(item.properties.published[0]).fromNow();
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
        {this.renderPhotos(item.properties.photo)}
        <CardContent>
          <Typography type="headline" component="h2">
            {item.properties.name}
          </Typography>
          {item.properties.summary && <Typography component="p">{item.properties.summary}</Typography>}
        </CardContent>

        {this.renderLocation(item.properties.location)}

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
  