import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Map from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import MapMarker from './map-marker';

const SingleAvatarMap = ({ lat, lng, author, theme }) => (
  <Map
    height={200}
    center={[lat, lng]}
    zoom={12}
    metaWheelZoom={true}
    provider={(x, y, z) =>
      theme === 'dark'
        ? `https://cartodb-basemaps-c.global.ssl.fastly.net/dark_all/${z}/${x}/${y}@2x.png`
        : `https://a.tile.openstreetmap.se/hydda/full/${z}/${x}/${y}.png`
    }
  >
    <Overlay anchor={[lat, lng]}>
      <MapMarker author={author} />
    </Overlay>
  </Map>
);

SingleAvatarMap.defaultProps = {
  author: '?',
};

SingleAvatarMap.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  theme: state.app.get('theme'),
});

export default connect(mapStateToProps)(SingleAvatarMap);
