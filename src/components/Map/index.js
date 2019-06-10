import React from 'react'
import PropTypes from 'prop-types'
import Map from 'pigeon-maps'
import useLocalState from '../../hooks/use-local-state'

const TogetherMap = ({ children, ...props }) => {
  const [localState] = useLocalState()

  return (
    <Map
      {...props}
      provider={(x, y, z) =>
        localState.theme === 'dark'
          ? `https://cartodb-basemaps-c.global.ssl.fastly.net/dark_all/${z}/${x}/${y}@2x.png`
          : `https://a.tile.openstreetmap.se/hydda/full/${z}/${x}/${y}.png`
      }
    >
      {children}
    </Map>
  )
}

TogetherMap.propTypes = {
  center: PropTypes.array.isRequired,
}

TogetherMap.defaultProps = {
  height: 200,
  zoom: 12,
  metaWheelZoom: true,
}

export default TogetherMap
