import React, { Fragment } from 'react'
import Map from '../../Map'
import MapMarker from '../../Map/Marker'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const TogetherCardLocation = ({ location, author }) => {
  let lat = false
  let lng = false
  if (!location) {
    return null
  }
  if (location.latitude && location.longitude) {
    lat = parseFloat(location.latitude)
    lng = parseFloat(location.longitude)
  }

  return (
    <Fragment>
      {location.name && (
        <CardContent>
          <Typography variant="caption">{location.name}</Typography>
        </CardContent>
      )}
      {lat !== false && lng !== false && (
        <Map center={[lat, lng]}>
          <MapMarker anchor={[lat, lng]} author={author} />
        </Map>
      )}
    </Fragment>
  )
}

export default TogetherCardLocation
