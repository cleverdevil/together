import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Map from 'pigeon-maps'
import Overlay from 'pigeon-overlay'
import WebMercatorViewport from 'viewport-mercator-project'
import useLocalState from '../../../hooks/use-local-state'
import Shortcuts from '../Shortcuts'
import MapMarker from '../../Map/Marker'

// TODO: Keyboard controls
// TODO: Mark read on open
const CheckinMap = ({ posts, channel }) => {
  // TODO: No markers shown
  const [localState] = useLocalState()
  const [viewport, setViewport] = useState(
    new WebMercatorViewport({
      latitude: 33.589062,
      longitude: -21.357864,
      zoom: 3,
      width:
        document.body.clientWidth >= 960
          ? document.body.clientWidth - 200
          : document.body.clientWidth, // Sidebar is 200px wide when shown
      height: document.body.clientHeight - 64, // The toolbar is 64px tall,
    })
  )

  const [focusedPost, setFocusedPost] = useState(null)

  const getAnchor = post => {
    if (post.location && post.location.latitude && post.location.longitude) {
      return [
        parseFloat(post.location.latitude),
        parseFloat(post.location.longitude),
      ]
    } else if (
      post.checkin &&
      post.checkin.latitude &&
      post.checkin.longitude
    ) {
      return [
        parseFloat(post.checkin.latitude),
        parseFloat(post.checkin.longitude),
      ]
    }
    return [0, 0]
  }

  const zoomToPosts = () => {
    const markers = posts.map(getAnchor)
    if (markers.length) {
      let maxLat = markers[0][0]
      let maxLng = markers[0][1]
      let minLat = markers[0][0]
      let minLng = markers[0][1]
      markers.forEach(marker => {
        const [lat, lng] = marker
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
        const boundedViewport = viewport.fitBounds(bounds)
        setViewport(new WebMercatorViewport(boundedViewport))
      } else if (markers.length === 1) {
        const viewport = Object.assign({}, viewport, {
          latitude: markers[0][0],
          longitude: markers[0][1],
          // zoom: viewport.zoom > 8 ? viewport.zoom : 11,
          zoom: 12,
        })
        setViewport(new WebMercatorViewport(viewport))
      }
    }
  }
  useEffect(zoomToPosts, [posts])

  const focusPost = postId => {
    // const index = markers.findIndex(marker => marker._id === postId)
    // if (index > -1) {
    //   setState({ focusedPost: postId })
    //   zoomToPosts([markers[index]])
    // } else {
    //   setState({ focusedPost: null })
    // }
  }

  const theme = localState.theme
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
    <Shortcuts
      style={{ display: 'block', overflow: 'hidden' }}
      onNext={() => {
        if (focusedPost !== null) {
          const index = posts.findIndex(marker => marker._id === focusedPost)
          if (index > -1 && posts[index + 1]) {
            this.focusPost(posts[index + 1]._id)
          }
        } else if (focusedPost === null && posts.length) {
          this.focusPost(posts[0]._id)
        }
      }}
      onPrevious={() => {
        if (focusedPost !== null) {
          const index = posts.findIndex(marker => marker._id === focusedPost)
          if (index > 0 && posts[index - 1]) {
            this.focusPost(posts[index - 1]._id)
          }
        }
      }}
      onMarkRead={() => {}}
    >
      <Map {...mapProps}>
        {posts.map((post, i) => (
          <Overlay anchor={getAnchor(post)} key={`marker-${i}`}>
            <MapMarker
              author={post.author}
              post={post}
              postOpen={post._id === focusedPost}
            />
          </Overlay>
        ))}
      </Map>
    </Shortcuts>
  )
}

CheckinMap.defaultProps = {
  posts: [],
}

CheckinMap.propTypes = {
  posts: PropTypes.array.isRequired,
}

export default CheckinMap
