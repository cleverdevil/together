import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Map from 'pigeon-maps'

const TogetherMap = ({ children, theme, ...props }) => (
  <Map
    {...props}
    provider={(x, y, z) =>
      theme === 'dark'
        ? `https://cartodb-basemaps-c.global.ssl.fastly.net/dark_all/${z}/${x}/${y}@2x.png`
        : `https://a.tile.openstreetmap.se/hydda/full/${z}/${x}/${y}.png`
    }
  >
    {children}
  </Map>
)

TogetherMap.propTypes = {
  center: PropTypes.array.isRequired,
}

TogetherMap.defaultProps = {
  height: 200,
  zoom: 12,
  metaWheelZoom: true,
}

const mapStateToProps = state => ({
  theme: state.app.get('theme'),
})

export default connect(mapStateToProps)(TogetherMap)
