import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import AuthorAvatar from '../AuthorAvatar'
import TogetherCardContent from './Content'
import TogetherCardPhotos from './Photos'
import TogetherCardLocation from './Location'
import TogetherCardReplyContext from './ReplyContext'
import TogetherCardActions from './Actions'
import moment from 'moment'
import authorToAvatarData from '../../modules/author-to-avatar-data'
import styles from './style'

const TogetherCard = ({
  post: item,
  expandableContent,
  shownActions,
  hideProperties,
  style,
  classes,
  selectedChannel,
}) => {
  // Parse author data
  const avatarData = authorToAvatarData(item.author)

  // Parse published date
  let date = 'unknown'
  if (item.published) {
    date = moment(item.published).fromNow()
  }

  if (!Array.isArray(shownActions)) {
    shownActions = ['consoleLog', 'markRead', 'remove']
    if (item.url) {
      shownActions.push('view')
    }
    if (item.url && !item['like-of'] && !item['repost-of']) {
      shownActions.push('like', 'repost', 'reply')
    }
  }

  let authorNameLink = (
    <a href={avatarData.href} target="_blank" rel="noopener noreferrer">
      {avatarData.alt}
    </a>
  )

  const property = (name, El) => {
    let value = item[name]
    if (value && !Array.isArray(value)) {
      value = [value]
    }
    if (value && Array.isArray(value) && !hideProperties.includes(name)) {
      return value.map((value, i) => (
        <El value={value} key={'post-property-' + name + i} />
      ))
    }
    return null
  }

  return (
    <Card className={classes.card} style={style}>
      {item.featured && <TogetherCardPhotos photos={item.featured} />}
      <CardHeader
        title={authorNameLink}
        subheader={date}
        avatar={<AuthorAvatar author={item.author || '?'} />}
      />

      {property('in-reply-to', ({ value: url }) => (
        <TogetherCardReplyContext
          type="reply"
          url={url}
          reference={item.refs ? item.refs[url] : null}
        />
      ))}

      {property('repost-of', ({ value: url }) => (
        <TogetherCardReplyContext
          type="repost"
          url={url}
          reference={item.refs ? item.refs[url] : null}
        />
      ))}

      {property('like-of', ({ value: url }) => (
        <TogetherCardReplyContext
          type="like"
          url={url}
          reference={item.refs ? item.refs[url] : null}
        />
      ))}

      {property('bookmark-of', ({ value: url }) => (
        <TogetherCardReplyContext
          type="bookmark"
          url={url}
          reference={item.refs ? item.refs[url] : null}
        />
      ))}

      {property('quotation-of', ({ value: url }) => (
        <TogetherCardReplyContext
          type="quotation"
          url={url}
          reference={item.refs ? item.refs[url] : null}
        />
      ))}

      {property('video', ({ value: video }) =>
        typeof video == 'string' ? (
          <CardMedia
            component="video"
            src={video}
            controls={true}
            poster={
              item.photo && item.photo.length === 1 ? item.photo[0] : null
            }
          />
        ) : null
      )}

      {property('audio', ({ value: audio }) =>
        typeof audio == 'string' ? (
          <CardMedia component="audio" src={audio} controls={true} />
        ) : null
      )}

      {/* TODO: This hides the single photo if there is a single video but I am not sure that is correct */}

      {item.photo &&
        !hideProperties.includes('photo') &&
        (!item.video || item.video.length !== 1) && (
          <TogetherCardPhotos photos={item.photo} />
        )}

      {!item['repost-of'] && (
        <TogetherCardContent expandable={expandableContent} post={item} />
      )}

      {property('checkin', ({ value: location }) => (
        <TogetherCardLocation location={location} author={item.author} />
      ))}
      {property('location', ({ value: location }) => (
        <TogetherCardLocation location={location} author={item.author} />
      ))}

      <TogetherCardActions
        post={item}
        channel={selectedChannel}
        shownActions={shownActions}
      />
    </Card>
  )
}

TogetherCard.defaultProps = {
  post: {},
  hideProperties: [],
  expandableContent: true,
}

TogetherCard.propTypes = {
  post: PropTypes.object.isRequired,
  shownActions: PropTypes.array,
  hideProperties: PropTypes.array.isRequired,
  expandableContent: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, props) => ({
  selectedChannel: props.channel || state.app.get('selectedChannel'),
})

export default connect(mapStateToProps)(withStyles(styles)(TogetherCard))
