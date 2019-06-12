import React, { Fragment, useRef } from 'react'
import PropTypes from 'prop-types'
import useMarkRead from '../../../hooks/use-mark-read'
import { withStyles } from '@material-ui/core/styles'
import 'intersection-observer'
import Observer from '@researchgate/react-intersection-observer'
import Button from '@material-ui/core/Button'
import ReactList from 'react-list'
import Shortcuts from '../Shortcuts'
import Post from '../../Post'
import styles from './style'

const Timeline = ({ classes, posts, channel, loadMore }) => {
  const ref = useRef()
  const markRead = useMarkRead()

  const handleIntersection = async entry => {
    if (!entry || !entry.intersectionRatio) {
      return null
    }

    const target = entry.target
    const itemId = target.dataset.id
    const itemIsRead = target.dataset.isread === 'true'

    if (channel && channel._t_autoRead && !itemIsRead) {
      markRead(channel.uid, itemId)
    }

    const isSecondLastItem =
      posts.length > 2 && itemId === posts[posts.length - 2]._id

    if (channel && channel._t_infiniteScroll && isSecondLastItem) {
      if (loadMore) {
        loadMore()
        return null
      }
      return true
    }

    return null
  }

  return (
    <Shortcuts
      onNext={() => {
        if (ref.current && ref.current.scrollParent) {
          ref.current.scrollParent.scrollBy(0, 50)
        }
      }}
      onPrevious={() => {
        if (ref.current && ref.current.scrollParent) {
          ref.current.scrollParent.scrollBy(0, -50)
        }
      }}
      onMarkRead={() => {}}
      className={classes.timeline}
    >
      <ReactList
        ref={ref}
        itemRenderer={(index, key) => (
          <Observer
            key={key}
            root={null}
            margin="1px"
            threshold={0}
            onChange={handleIntersection}
          >
            <Post post={posts[index]} />
          </Observer>
        )}
        length={posts.length}
        type="simple"
        minSize={3}
      />

      {channel && loadMore && (
        <Button className={classes.loadMore} onClick={loadMore}>
          Load More
        </Button>
      )}
    </Shortcuts>
  )
}

Timeline.defaultProps = {
  posts: [],
}

Timeline.propTypes = {
  posts: PropTypes.array.isRequired,
}

export default withStyles(styles)(Timeline)
