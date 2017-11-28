import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import { Map, Marker, TileLayer, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import TogetherCard from './card';
import authorToAvatarData from '../modules/author-to-avatar-data';

const markerSize = 18;

const styles = theme => ({
  map: {
    height: '100vh',
  },
  marker: {
    width: markerSize,
    height: markerSize,
    fontSize: markerSize - (markerSize / 2),
  },
});

class CheckinMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPost: null,
    };
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  render() {
    let bounds = false;
    const markers = this.props.posts.map((post, i) => {
      let lat = false;
      let lng = false;
      if (post.location && this.isNumeric(post.location.latitude) && this.isNumeric(post.location.longitude)) {
        lat = parseFloat(post.location.latitude);
        lng = parseFloat(post.location.longitude);
      } else if (post.checkin && this.isNumeric(post.checkin.latitude) && this.isNumeric(post.checkin.longitude)) {
        lat = parseFloat(post.checkin.latitude);
        lng = parseFloat(post.checkin.longitude);
      }
      if (lat === false || lng === false) {
        return null;
      } else {
        // Expand the bounds to fit the marker
        if (!bounds && lat !== false && lng !== false) {
          bounds = [[lat, lng], [lat, lng]];
        } else {
          if (lat < bounds[0][0]) {
            bounds[0][0] = lat;
          }
          if (lat > bounds[1][0]) {
            bounds[1][0] = lat;
          }
          if (lng < bounds[0][1]) {
            bounds[0][1] = lng;
          }
          if (lng > bounds[1][1]) {
            bounds[1][1] = lng;
          }
        }

        // Create the marker icon
        const avatarData = authorToAvatarData(post.author);
        const icon = divIcon({
          className: 'together-checkin-marker',
          iconSize: markerSize,
          html: renderToStaticMarkup(
            <Avatar
              className={this.props.classes.marker}
              {...avatarData}
              aria-label={avatarData.alt}
            >
              {avatarData.src ? null : avatarData.initials}
            </Avatar>
          ),
        });

        // Return the marker and popup
        return (
          <Marker icon={icon} key={`checkin-marker-${i}`} position={[lat, lng]}>
            <Popup>
              <TogetherCard post={post} embedMode="marker" store={null} />
            </Popup>
          </Marker>
        );
      }
    });

    let mapProps = {
      center: [0,0],
      zoom: 2,
      // scrollWheelZoom={false}
      className: this.props.classes.map,
    }
    if (bounds) {
      mapProps.bounds = bounds;
    }
    return (
      <Map
        {...mapProps}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'
          attribution='Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={18}
        />
        {markers}
      </Map>
    );
  }
}
  
CheckinMap.defaultProps = {
  posts: [],
};

CheckinMap.propTypes = {
  posts: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(CheckinMap));