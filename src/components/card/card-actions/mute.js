import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MuteIcon from '@material-ui/icons/VolumeOff';
import BaseAction from './base-action';
import { addNotification, removePost } from '../../../actions';
import { posts as postsService } from '../../../modules/feathers-services';

const ActionMute = ({
  _id,
  url,
  notification,
  removePost,
  channel,
  menuItem,
}) => (
  <BaseAction
    title={'Mute user'}
    onClick={() => {
      postsService
        .update(url, {
          channel,
          mute: url,
        })
        .then(res => {
          removePost(_id);
          notification('User muted');
        })
        .catch(err => {
          console.log('Error muting user', err);
          notification('Error muting user', 'error');
        });
    }}
    icon={<MuteIcon />}
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
)(ActionMute);
