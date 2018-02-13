import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import Dimensions from 'react-dimensions';
import ReactMapGL, { Marker } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import MapMarker from './map-marker';

const markerSize = 18;

const styles = theme => ({
  map: {},
});

class CheckinMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
      zoom: 1,
      markers: [],
    };
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  componentDidMount() {
    let bounds = false;

    let posts = this.props.posts.map((post, i) => {
      let lat = false;
      let lng = false;
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
        post.marker = {
          lat: lat,
          lng: lng,
        };
        return post;
      }
    });

    posts.filter(post => post);
    this.setState({ markers: posts });

    if (bounds) {
      const viewport = new WebMercatorViewport({
        width: this.props.containerWidth,
        height: document.body.clientHeight,
      });
      // This doesn't work at the moment for reasons I don't understand
      // const bound = viewport.fitBounds(bounds, { padding: 20 });

      // this.setState({
      //   lat: bound.latitude,
      //   lng: bound.longitude,
      //   zoom: bound.zoom,
      // });
    }
  }

  render() {
    return (
      <ReactMapGL
        width={this.props.containerWidth}
        height={window.innerHeight - 72} // 72 = height of the title
        latitude={this.state.lat}
        longitude={this.state.lng}
        zoom={this.state.zoom}
        className={this.props.classes.map}
        mapStyle="mapbox://styles/mapbox/basic-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiZ3JhbnRjb2RlcyIsImEiOiJjamJ3ZTk3czYyOHAxMzNyNmo4cG4zaGFqIn0.9tRVGo4SgVgns3khwoO0gA"
        onViewportChange={viewport => {
          const { width, height, latitude, longitude, zoom } = viewport;
          this.setState({
            lat: latitude,
            lng: longitude,
            zoom: zoom,
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

export default connect(null, mapDispatchToProps)(
  Dimensions()(withStyles(styles)(CheckinMap)),
);
