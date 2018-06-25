import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import AuthorAvatar from '../author-avatar';
import TogetherCardContent from './card-content';
import TogetherCardPhotos from './card-photos';
import TogetherCardLocation from './card-location';
import TogetherCardReplyContext from './card-reply-context';
import TogetherCardActions from './card-actions';
import moment from 'moment';
import authorToAvatarData from '../../modules/author-to-avatar-data';

const styles = theme => ({
  card: {
    marginTop: 12,
    marginBottom: 12,
    overflow: 'hidden',
    '& a': {
      color:
        theme.palette.type === 'dark'
          ? theme.palette.secondary.light
          : theme.palette.secondary.main,
    },
  },
});

const TogetherCard = props => {
  const item = props.post;

  // Parse author data
  const avatarData = authorToAvatarData(item.author);

  // Parse published date
  let date = 'unknown';
  if (item.published) {
    date = moment(item.published).fromNow();
  }

  let shownActions = props.shownActions;
  if (props.shownActions === null) {
    shownActions = ['consoleLog', 'markRead'];
    if (item.url) {
      shownActions.push('view');
    }
    if (item.url && !item['like-of'] && !item['repost-of']) {
      shownActions.push('like', 'repost', 'reply');
    }
  }

  let authorNameLink = (
    <a href={avatarData.href} target="_blank">
      {avatarData.alt}
    </a>
  );

  const property = (name, El) => {
    if (
      item[name] &&
      Array.isArray(item[name]) &&
      !props.hideProperties.includes(name)
    ) {
      return item[name].map((value, i) => (
        <El value={value} key={'post-property-' + name + i} />
      ));
    }
    return null;
  };

  return (
    <Card className={props.classes.card} style={props.style}>
      {item.featured && <TogetherCardPhotos photos={item.featured} />}
      <CardHeader
        title={authorNameLink}
        subheader={date}
        avatar={<AuthorAvatar author={item.author} />}
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

      {property(
        'video',
        ({ value: video }) =>
          typeof video == 'string' ? (
            <CardMedia component="video" src={video} controls={true} />
          ) : null,
      )}

      {property(
        'audio',
        ({ value: audio }) =>
          typeof audio == 'string' ? (
            <CardMedia component="audio" src={audio} controls={true} />
          ) : null,
      )}

      {/* TODO: This hides the single photo if there is a single video but I am not sure that is correct */}

      {item.photo &&
        !props.hideProperties.includes('photo') &&
        (!item.video || item.video.length !== 1) && (
          <TogetherCardPhotos photos={item.photo} />
        )}

      {!item['repost-of'] && <TogetherCardContent post={item} />}

      {property('checkin', ({ value: location }) => (
        <TogetherCardLocation location={location} author={item.author} />
      ))}
      {property('location', ({ value: location }) => (
        <TogetherCardLocation location={location} author={item.author} />
      ))}

      <TogetherCardActions
        post={item}
        channel={props.selectedChannel}
        shownActions={shownActions}
      />
    </Card>
  );
};

TogetherCard.defaultProps = {
  post: {},
  shownActions: null,
  hideProperties: [],
};

TogetherCard.propTypes = {
  post: PropTypes.object.isRequired,
  shownActions: PropTypes.array.isRequired,
  hideProperties: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  return {
    selectedChannel: props.channel || state.app.get('selectedChannel'),
  };
}

export default connect(mapStateToProps)(withStyles(styles)(TogetherCard));
