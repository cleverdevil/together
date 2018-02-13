import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Dimensions from 'react-dimensions';
import ReactMapGL, { Marker } from 'react-map-gl';
import MapMarker from './map-marker';

const styles = theme => ({
  map: {
    height: 200,
  },
});

class SingleAvatarMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: props.lat,
      lng: props.lng,
    };
  }

  render() {
    return (
      <ReactMapGL
        width={this.props.containerWidth}
        height={200}
        latitude={this.state.lat}
        longitude={this.state.lng}
        zoom={12}
        scrollZoom={false}
        className={this.props.classes.map}
        mapStyle="mapbox://styles/mapbox/basic-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiZ3JhbnRjb2RlcyIsImEiOiJjamJ3ZTk3czYyOHAxMzNyNmo4cG4zaGFqIn0.9tRVGo4SgVgns3khwoO0gA"
        onViewportChange={viewport => {
          const { width, height, latitude, longitude, zoom } = viewport;
          this.setState({
            lat: latitude,
            lng: longitude,
          });
        }}
      >
        <Marker latitude={this.props.lat} longitude={this.props.lng}>
          <MapMarker author={this.props.author} />
        </Marker>
      </ReactMapGL>
    );
  }
}

SingleAvatarMap.defaultProps = {
  author: '?',
};

SingleAvatarMap.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

export default Dimensions()(withStyles(styles)(SingleAvatarMap));
