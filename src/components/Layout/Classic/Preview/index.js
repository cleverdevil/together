import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import AuthorAvatar from '../../../AuthorAvatar'
import moment from 'moment'
import styles from './style'

class ClassicPreview extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.getPreviewText = this.getPreviewText.bind(this)
  }

  handleClick() {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  getPreviewText(maxLength = 80) {
    const item = this.props.post
    let text = ''

    if (item.name) {
      text = item.name
    } else if (item.summary) {
      text = item.summary
    } else if (item.content) {
      const contentObject = item.content
      if (contentObject.value) {
        text = contentObject.value
      } else if (contentObject.html) {
        text = contentObject.html.replace(/<\/?[^>]+(>|$)/g, '')
      }
    }

    if (text.length > maxLength) {
      text = text.substring(0, maxLength)
      text += '…'
    }

    return text
  }

  render() {
    const { post, highlighted, classes } = this.props

    // Parse published date
    let date = 'unknown'
    if (post.published) {
      date = moment(post.published).fromNow()
    }

    let classNames = [classes.item]

    if (post._is_read) {
      classNames.push(classes.read)
    }
    if (highlighted) {
      classNames.push(classes.highlighted)
    }

    return (
      <ListItem
        dense
        button
        onClick={this.handleClick}
        className={classNames.join(' ')}
        data-id={post._id}
        data-isread={post._is_read}
      >
        <AuthorAvatar author={post.author} />
        <ListItemText
          primary={this.getPreviewText()}
          secondary={date}
          className={classes.text}
        />
      </ListItem>
    )
  }
}

ClassicPreview.defaultProps = {
  post: {},
  highlighted: false,
}

ClassicPreview.propTypes = {
  post: PropTypes.object.isRequired,
  highlighted: PropTypes.bool.isRequired,
}

export default withStyles(styles)(ClassicPreview)
