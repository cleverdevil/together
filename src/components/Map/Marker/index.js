import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import AuthorAvatar from '../../AuthorAvatar'
import Post from '../../Post'
import styles, { markerSize } from './style'

class MapMarker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      postOpen: false,
      anchor: null,
    }
    this.handleClick = this.handleClick.bind(this)
    this.renderPost = this.renderPost.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    this.setState({
      postOpen: true,
      anchor: e.target,
    })
  }

  renderPost() {
    if (!this.props.post) {
      return null
    }
    return (
      <Popover
        open={this.state.postOpen}
        className={this.props.classes.popover}
        anchorEl={this.state.anchor}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        onClose={() => this.setState({ postOpen: false })}
        onBackdropClick={() => this.setState({ postOpen: false })}
      >
        <Post
          post={this.props.post}
          style={{ boxShadow: 'none', margin: 0 }}
          hideProperties={['checkin', 'location']}
        />
      </Popover>
    )
  }

  render() {
    const { classes, author, left, top } = this.props
    return (
      <Fragment>
        <div
          className={classes.marker}
          onClick={this.handleClick}
          style={{ left, top }}
        >
          <AuthorAvatar author={author} size={markerSize} />
        </div>
        {this.renderPost()}
      </Fragment>
    )
  }
}

MapMarker.defaultProps = {
  author: '?',
}

MapMarker.propTypes = {
  post: PropTypes.object,
  author: PropTypes.any.isRequired,
}

export default withStyles(styles)(MapMarker)
