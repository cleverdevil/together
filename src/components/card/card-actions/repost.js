import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import RepostIcon from '@material-ui/icons/Repeat';
import { addNotification } from '../../../actions';
import { micropub } from '../../../modules/feathers-services';

const ActionRepost = ({ url, syndication, notification }) => (
  <Tooltip title="Repost" placement="top">
    <IconButton
      onClick={e => {
        const mf2 = {
          type: ['h-entry'],
          properties: {
            'repost-of': [url],
          },
        };
        if (syndication.length) {
          mf2.properties['mp-syndicate-to'] = syndication;
        }
        micropub
          .create({ post: mf2 })
          .then(res => notification(`Successfully liked ${url}`))
          .catch(err => notification(`Error liking ${url}`, 'error'));
      }}
    >
      <RepostIcon />
    </IconButton>
  </Tooltip>
);

const mapStateToProps = state => ({
  syndication: state.settings.get('repostSyndication') || [],
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ notification: addNotification }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionRepost);
