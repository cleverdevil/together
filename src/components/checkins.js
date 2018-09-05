import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Dimensions from 'react-dimensions';
import ReactMapGL, { Marker } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import MapMarker from './map-marker';
import 'mapbox-gl/dist/mapbox-gl.css';

const styles = theme => ({
  map: {},
});

class CheckinMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: new WebMercatorViewport({
        latitude: 33.589062,
        longitude: -21.357864,
        zoom: 1.5,
        width: props.containerWidth,
        height: document.body.clientHeight - 64, // The toolbar is 64px tall,
      }),
      markers: [],
    };
    this.setMarkers = this.setMarkers.bind(this);
    this.zoomToPosts = this.zoomToPosts.bind(this);
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  setMarkers(posts) {
    posts = posts.map((post, i) => {
      let lat = false;
      let lng = false;
      if (post.marker) {
        return post;
      }
      if (
        post.location &&
        this.isNumeric(post.location.latitude) &&
        this.isNumeric(post.location.longitude)
      ) {
        lat = parseFloat(post.location.latitude);
        lng = parseFloat(post.location.longitude);
      } else if (
        post.checkin &&
        this.isNumeric(post.checkin.latitude) &&
        this.isNumeric(post.checkin.longitude)
      ) {
        lat = parseFloat(post.checkin.latitude);
        lng = parseFloat(post.checkin.longitude);
      }
      if (lat === false || lng === false) {
        return null;
      } else {
        post.marker = {
          lat: lat,
          lng: lng,
        };
        return post;
      }
    });
    posts = posts.filter(post => post);
    this.setState({ markers: posts });
    this.zoomToPosts(posts);
  }

  zoomToPosts(posts) {
    const markers = posts.map(post => post.marker);
    if (markers.length) {
      let maxLat = markers[0].lat;
      let maxLng = markers[0].lng;
      let minLat = markers[0].lat;
      let minLng = markers[0].lng;
      markers.forEach(marker => {
        const { lat, lng } = marker;
        if (lat > maxLat) {
          maxLat = lat;
        }
        if (lng > maxLng) {
          maxLng = lng;
        }
        if (lng < minLng) {
          minLng = lng;
        }
        if (lat < minLat) {
          minLat = lat;
        }
      });
      if (maxLat != minLat && maxLng != minLng) {
        const bounds = [[maxLng, maxLat], [minLng, minLat]];
        const boundedViewport = this.state.viewport.fitBounds(bounds, {
          padding: 30,
        });
        this.setState({
          viewport: new WebMercatorViewport(boundedViewport),
        });
      } else if (markers.length === 1) {
        const viewport = Object.assign({}, this.state.viewport, {
          latitude: markers[0].lat,
          longitude: markers[0].lng,
          zoom: this.state.viewport.zoom > 8 ? this.state.viewport.zoom : 11,
        });
        this.setState({ viewport: new WebMercatorViewport(viewport) });
      }
    }
  }

  componentDidMount() {
    this.setMarkers(this.props.posts);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.posts.length != this.state.markers.length) {
      this.setMarkers(newProps.posts);
    }
  }

  render() {
    return (
      <ReactMapGL
        {...this.state.viewport}
        className={this.props.classes.map}
        mapStyle="mapbox://styles/mapbox/basic-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiZ3JhbnRjb2RlcyIsImEiOiJjamJ3ZTk3czYyOHAxMzNyNmo4cG4zaGFqIn0.9tRVGo4SgVgns3khwoO0gA"
        onViewportChange={viewport => {
          this.setState({
            viewport: new WebMercatorViewport(viewport),
          });
        }}
      >
        {this.state.markers.map((post, i) => {
          return (
            <Marker
              latitude={post.marker.lat}
              longitude={post.marker.lng}
              key={`marker-${i}`}
            >
              <MapMarker author={post.author} post={post} />
            </Marker>
          );
        })}
      </ReactMapGL>
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
  return bindActionCreators({}, dispatch);
}

export default connect(
  null,
  mapDispatchToProps,
)(Dimensions()(withStyles(styles)(CheckinMap)));
