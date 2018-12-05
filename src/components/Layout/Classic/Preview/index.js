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
    const item = this.props.post

    // Parse published date
    let date = 'unknown'
    if (item.published) {
      date = moment(item.published).fromNow()
    }

    let readStyle = {}
    if (item._is_read) {
      readStyle.opacity = 0.5
    }

    return (
      <ListItem
        dense
        button
        onClick={this.handleClick}
        style={readStyle}
        className={this.props.classes.item}
        data-id={item._id}
        data-isread={item._is_read}
      >
        <AuthorAvatar author={item.author} />
        <ListItemText
          primary={this.getPreviewText()}
          secondary={date}
          className={this.props.classes.text}
        />
      </ListItem>
    )
  }
}

ClassicPreview.defaultProps = {
  post: {},
}

ClassicPreview.propTypes = {
  post: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClassicPreview)
