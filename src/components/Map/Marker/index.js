import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import AuthorAvatar from '../../AuthorAvatar'
import Post from '../../Post'
import styles, { markerSize } from './style'

const MapMarker = ({ classes, post, postOpen = false, author, left, top }) => {
  const [open, setOpen] = useState(postOpen)
  const [anchor, setAnchor] = useState(null)

  // TODO: Check prop based open works too

  // componentDidUpdate(prevProps) {
  //   if (prevProps.postOpen !== this.props.postOpen) {
  //     if (this.props.postOpen && !this.state.postOpen) {
  //       this.setState({ postOpen: true })
  //     } else if (!this.props.postOpen && this.state.postOpen) {
  //       this.setState({ postOpen: false })
  //     }
  //   }
  // }

  // handleClick(e) {
  //   e.preventDefault()
  //   this.setState({
  //     postOpen: true,
  //     anchor: e.target,
  //   })
  // }

  return (
    <Fragment>
      <div
        className={classes.marker}
        onClick={e => {
          setOpen(true)
          setAnchor(e.target)
          e.preventDefault()
        }}
        style={{ left, top }}
      >
        <AuthorAvatar author={author} size={markerSize} />
      </div>
      {!!post && (
        <Popover
          disableAutoFocus
          open={postOpen || open}
          className={classes.popover}
          anchorEl={anchor}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          onClose={() => setOpen(false)}
          onBackdropClick={() => setOpen(false)}
        >
          <Post
            post={post}
            style={{ boxShadow: 'none', margin: 0 }}
            hideProperties={['checkin', 'location']}
          />
        </Popover>
      )}
    </Fragment>
  )
}

MapMarker.defaultProps = {
  author: '?',
}

MapMarker.propTypes = {
  post: PropTypes.object,
  postOpen: PropTypes.bool,
  author: PropTypes.any.isRequired,
}

export default withStyles(styles)(MapMarker)
