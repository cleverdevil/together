import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ReadIcon from '@material-ui/icons/PanoramaFishEye';
import UnreadIcon from '@material-ui/icons/Lens';
import {
  addNotification,
  decrementChannelUnread,
  incrementChannelUnread,
  updatePost,
} from '../../../actions';
import { posts as postsService } from '../../../modules/feathers-services';

const ActionMarkRead = ({
  _id,
  isRead,
  notification,
  channel,
  updatePost,
  incrementChannelUnread,
  decrementChannelUnread,
}) => (
  <Tooltip title={'Mark as ' + (isRead ? 'Unread' : 'Read')} placement="top">
    <IconButton
      onClick={() => {
        console.log('selectedChannel', channel);
        if (isRead === false) {
          updatePost(_id, '_is_read', true);
          postsService
            .update(_id, {
              channel: channel,
              method: 'mark_read',
            })
            .then(res => {
              decrementChannelUnread(channel);
              notification('Marked as read');
            })
            .catch(err => {
              console.log(err);
              updatePost(_id, '_is_read', false);
              notification('Error marking as read', 'error');
            });
        } else if (isRead === true) {
          updatePost(_id, '_is_read', false);
          postsService
            .update(_id, {
              method: 'mark_unread',
              channel: channel,
            })
            .then(res => {
              incrementChannelUnread(channel);
              notification('Marked as unread');
            })
            .catch(err => {
              console.log(err);
              updatePost(_id, '_is_read', true);
              notification('Error marking as unread', 'error');
            });
        }
      }}
    >
      {isRead ? <ReadIcon /> : <UnreadIcon />}
    </IconButton>
  </Tooltip>
);

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updatePost,
      incrementChannelUnread,
      decrementChannelUnread,
      notification: addNotification,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionMarkRead);
