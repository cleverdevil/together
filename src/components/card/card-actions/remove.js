import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RemoveIcon from '@material-ui/icons/Delete';
import BaseAction from './base-action';
import { addNotification, removePost } from '../../../actions';
import { posts as postsService } from '../../../modules/feathers-services';

const ActionRemove = ({ _id, notification, removePost, channel, menuItem }) => (
  <BaseAction
    title={'Remove from channel'}
    onClick={() => {
      postsService
        .update(_id, {
          channel: channel,
          method: 'remove',
        })
        .then(res => {
          removePost(_id);
          notification('Post removed');
        })
        .catch(err => {
          console.log('Error removing post', err);
          notification('Error removing post', 'error');
        });
    }}
    icon={<RemoveIcon />}
    menuItem={menuItem}
  />
);

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      notification: addNotification,
      removePost,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionRemove);
