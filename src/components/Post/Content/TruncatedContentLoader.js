import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo-hooks'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useSnackbar } from 'notistack'
import { REFETCH_POST } from '../../../queries'

const hasTruncatedContent = post => {
  const html =
    post && post.content ? post.content.html || post.content.text : null
  const url = post && post.url ? post.url : null

  if (!html || !url) {
    return false
  }

  // If twitter url then almost certainly not truncated
  if (new URL(url).hostname === 'twitter.com') {
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
      const truncateWords = ['continue', 'read', 'more']
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

const TruncatedContentLoader = ({ post }) => {
  const [loading, setLoading] = useState(false)
  const [isTruncated, setIsTruncated] = useState(hasTruncatedContent(post))
  const { enqueueSnackbar } = useSnackbar()
  const refetchPost = useMutation(REFETCH_POST, {
    variables: { post: post._id, url: post.url },
  })

  useEffect(() => {
    setIsTruncated(hasTruncatedContent(post))
  }, [post.url])

  const handleLoad = async e => {
    e.preventDefault()
    setLoading(true)
    const {
      data: { refetchPost: update },
      error,
    } = await refetchPost()
    setLoading(false)
    setIsTruncated(false)
    if (error) {
      enqueueSnackbar('Error loading post content', { variant: 'error' })
    } else if (!update || !update.content) {
      enqueueSnackbar('Could not parse post content', { variant: 'warning' })
    }
  }

  if (isTruncated) {
    return (
      <Button
        size="small"
        variant="text"
        style={{ marginTop: 30 }}
        onClick={handleLoad}
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

TruncatedContentLoader.propTypes = {
  post: PropTypes.object.isRequired,
}

export default TruncatedContentLoader
