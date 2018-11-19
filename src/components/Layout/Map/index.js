import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Map from 'pigeon-maps'
import Overlay from 'pigeon-overlay'
import WebMercatorViewport from 'viewport-mercator-project'
import MapMarker from '../../Map/Marker'

class CheckinMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewport: new WebMercatorViewport({
        latitude: 33.589062,
        longitude: -21.357864,
        zoom: 3,
        width:
          document.body.clientWidth >= 960
            ? document.body.clientWidth - 200
            : document.body.clientWidth, // Sidebar is 200px wide when shown
        height: document.body.clientHeight - 64, // The toolbar is 64px tall,
      }),
      markers: [],
    }
    this.setMarkers = this.setMarkers.bind(this)
    this.zoomToPosts = this.zoomToPosts.bind(this)
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  }

  setMarkers(posts) {
    posts = posts.map(post => {
      let lat = false
      let lng = false
      if (post.marker) {
        return post
      }
      if (
        post.location &&
        this.isNumeric(post.location.latitude) &&
        this.isNumeric(post.location.longitude)
      ) {
        lat = parseFloat(post.location.latitude)
        lng = parseFloat(post.location.longitude)
      } else if (
        post.checkin &&
        this.isNumeric(post.checkin.latitude) &&
        this.isNumeric(post.checkin.longitude)
      ) {
        lat = parseFloat(post.checkin.latitude)
        lng = parseFloat(post.checkin.longitude)
      }
      if (lat === false || lng === false) {
        return null
      } else {
        post.marker = {
          lat: lat,
          lng: lng,
        }
        return post
      }
    })
    posts = posts.filter(post => post)
    this.setState({ markers: posts })
    this.zoomToPosts(posts)
  }

  zoomToPosts(posts) {
    const markers = posts.map(post => post.marker)
    if (markers.length) {
      let maxLat = markers[0].lat
      let maxLng = markers[0].lng
      let minLat = markers[0].lat
      let minLng = markers[0].lng
      markers.forEach(marker => {
        const { lat, lng } = marker
        if (lat > maxLat) {
          maxLat = lat
        }
        if (lng > maxLng) {
          maxLng = lng
        }
        if (lng < minLng) {
          minLng = lng
        }
        if (lat < minLat) {
          minLat = lat
        }
      })
      if (maxLat !== minLat && maxLng !== minLng) {
        const bounds = [[maxLng, maxLat], [minLng, minLat]]
        const boundedViewport = this.state.viewport.fitBounds(bounds)
        this.setState({
          viewport: new WebMercatorViewport(boundedViewport),
        })
      } else if (markers.length === 1) {
        const viewport = Object.assign({}, this.state.viewport, {
          latitude: markers[0].lat,
          longitude: markers[0].lng,
          zoom: this.state.viewport.zoom > 8 ? this.state.viewport.zoom : 11,
        })
        this.setState({ viewport: new WebMercatorViewport(viewport) })
      }
    }
  }

  componentDidMount() {
    this.setMarkers(this.props.posts)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.posts.length !== this.state.markers.length) {
      this.setMarkers(newProps.posts)
    }
  }

  render() {
    const { viewport, markers } = this.state
    const { theme } = this.props
    const mapProps = {
      center: [viewport.latitude, viewport.longitude],
      zoom: viewport.zoom,
      style: {
        width: '100%',
        height: '100%',
      },
      provider: (x, y, z) =>
        theme === 'dark'
          ? `https://cartodb-basemaps-c.global.ssl.fastly.net/dark_all/${z}/${x}/${y}@2x.png`
          : `https://a.tile.openstreetmap.se/hydda/full/${z}/${x}/${y}.png`,
    }
    return (
      <Map {...mapProps}>
        {markers.map((post, i) => {
          return (
            <Overlay
              anchor={[post.marker.lat, post.marker.lng]}
              key={`marker-${i}`}
            >
              <MapMarker author={post.author} post={post} />
            </Overlay>
          )
        })}
      </Map>
    )
  }
}

CheckinMap.defaultProps = {
  posts: [],
}

CheckinMap.propTypes = {
  posts: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  theme: state.app.get('theme'),
})

export default connect(mapStateToProps)(CheckinMap)
