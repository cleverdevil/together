import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { addNotification, updatePost } from '../../../actions'

class TruncatedContentLoader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      isTruncated: this.hasTruncatedContent(props.post),
    }
    this.handleLoad = this.handleLoad.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.post) {
      this.setState({ isTruncated: this.hasTruncatedContent(newProps.post) })
    }
  }

  hasTruncatedContent(post) {
    const html =
      post && post.content ? post.content.html || post.content.text : null
    const url = post && post.url ? post.url : null

    if (!html || !url) {
      return false
    }

    const el = document.createElement('div')
    el.innerHTML = html
    if (el.innerText.endsWith('...')) {
      // The content ends with an ellipsis, it is probably truncated
      return true
    }
    if (url) {
      const selfLink = el.querySelector(`a[href^="${url}"]`)
      if (selfLink) {
        // The content links to itself. It might be truncated
        const linkText = selfLink.innerText.toLowerCase()
        const truncateWords = ['continue', 'read', 'more'] // TODO: This probably needs more words / languages
        for (const word of truncateWords) {
          if (linkText.includes(word)) {
            // The text contains one of the words above so probably is truncated
            return true
          }
        }
      }
    }
    return false
  }

  async handleLoad(e) {
    e.preventDefault()
    this.setState({ loading: true })
    const { post, notification, updatePost } = this.props
    const url = post.url
    const apiUrl =
      process.env.REACT_APP_API_SERVER + '/api/parse/' + encodeURIComponent(url)
    const res = await fetch(apiUrl)
    const data = await res.json()
    this.setState({ isTruncated: false, loading: false })
    if (data.error) {
      notification('Error parsing full content', 'error')
      console.log('Error parsing full content', data.error)
    } else if (data.article && data.article.content) {
      updatePost(post._id, 'content', { html: data.article.content })
    } else {
      notification('Full content not found', 'error')
    }
  }

  render() {
    const { isTruncated, loading } = this.state
    if (isTruncated) {
      return (
        <Button
          size="small"
          variant="text"
          style={{ marginTop: 30 }}
          onClick={this.handleLoad}
          disabled={loading}
          fullWidth
        >
          Load Full Post
          {loading && (
            <CircularProgress
              size={20}
              color="inherit"
              style={{ marginLeft: 10 }}
            />
          )}
        </Button>
      )
    }
    return null
  }
}

TruncatedContentLoader.propTypes = {
  post: PropTypes.object.isRequired,
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updatePost,
      notification: addNotification,
    },
    dispatch
  )

export default connect(
  null,
  mapDispatchToProps
)(TruncatedContentLoader)
