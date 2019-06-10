import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import useMarkRead from '../../../hooks/use-mark-read'
import 'intersection-observer'
import Observer from '@researchgate/react-intersection-observer'
import List from '@material-ui/core/List'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'
import ReactList from 'react-list'
// import Shortcuts from '../Shortcuts'
import Preview from './Preview'
import Post from '../../Post'
import styles from './style'

const ClassicView = ({ classes, posts, channel, loadMore }) => {
  const [selectedPostId, setSelectedPostId] = useState(null)
  const articleRef = useRef()
  const listRef = useRef()
  const markRead = useMarkRead()

  const infiniteScrollEnabled = true
  const postIndex = selectedPostId
    ? posts.findIndex(post => post._id === selectedPostId)
    : -1
  const hasNextPost = posts[postIndex + 1] ? true : false
  const hasPreviousPost = postIndex > 0 && posts[postIndex - 1] ? true : false

  const handleIntersection = entry => {
    if (!entry || !entry.intersectionRatio) {
      return null
    }

    const target = entry.target
    const itemId = target.dataset.id

    // TODO: Handle infinite scroll options
    const isSecondLastItem = itemId === posts[posts.length - 2]._id

    if (
      posts &&
      posts.length &&
      infiniteScrollEnabled &&
      isSecondLastItem &&
      loadMore
    ) {
      loadMore()
    }
  }

  const handlePostSelect = post => {
    const index = posts.findIndex(p => p._id === post._id)
    setSelectedPostId(post._id)
    if (articleRef.current) {
      articleRef.current.scrollTop = 0
    }
    // Mark the post as read
    markRead(channel.uid, post._id)
    // Load the next posts if reading the final post
    if (index === posts.length - 1 && loadMore) {
      loadMore()
    }
    // Scroll the selected post into view
    listRef.current.scrollAround(index)
  }

  const handleNextPost = () => {
    const nextIndex = selectedPostId
      ? posts.findIndex(post => post._id === selectedPostId) + 1
      : false
    if (nextIndex && posts[nextIndex]) {
      setSelectedPostId(posts[nextIndex]._id)
    }
  }

  const handlePreviousPost = () => {
    const previousIndex = selectedPostId
      ? posts.findIndex(post => post._id === selectedPostId) - 1
      : false
    if (previousIndex !== false && previousIndex > -1) {
      setSelectedPostId(posts[previousIndex]._id)
    }
  }

  return (
    <div className={classes.wrapper}>
      {/* <Shortcuts
        className={classes.wrapper}
        onNext={handleNextPost}
        onPrevious={handlePreviousPost}
        onMarkRead={() => {}}
      > */}
      <List className={classes.previewColumn} id="classic-view-previews">
        <ReactList
          itemRenderer={(index, key) => {
            const post = posts[index]
            return (
              <Observer
                key={key}
                root={'#classic-view-previews'}
                margin="0px"
                threshold={0}
                onChange={handleIntersection}
              >
                <Preview
                  post={post}
                  onClick={() => handlePostSelect(post)}
                  highlighted={selectedPostId === post._id}
                />
              </Observer>
            )
          }}
          length={posts.length}
          type="simple"
          minSize={3}
          ref={listRef}
        />
        {!infiniteScrollEnabled && loadMore && (
          <Button className={classes.loadMore} onClick={loadMore}>
            Load More
          </Button>
        )}
      </List>
      {!!selectedPostId && (
        <div ref={articleRef} className={classes.postColumn}>
          <Post
            focus
            post={posts.find(post => post._id === selectedPostId)}
            expandableContent={false}
            style={{
              margin: 0,
              minHeight: 'calc(100% - 48px)',
              maxWidth: 700,
              boxShadow: 'none',
            }}
            shortcutOnNext={handleNextPost}
            scrollElement={articleRef.current}
          />
          <AppBar
            position="sticky"
            color="default"
            style={{ bottom: 0, maxWidth: 700, boxShadow: 'none' }}
          >
            <Toolbar variant="dense">
              <Button onClick={handlePreviousPost} disabled={!hasPreviousPost}>
                Previous
              </Button>
              <Button onClick={handleNextPost} disabled={!hasNextPost}>
                Next
              </Button>
              <Button onClick={() => setSelectedPostId(null)}>Close</Button>
            </Toolbar>
          </AppBar>
        </div>
      )}
      {/* </Shortcuts> */}
    </div>
  )
}

ClassicView.defaultProps = {
  posts: [],
}

ClassicView.propTypes = {
  posts: PropTypes.array.isRequired,
}

export default withStyles(styles)(ClassicView)
