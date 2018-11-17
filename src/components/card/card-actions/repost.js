import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RepostIcon from '@material-ui/icons/Repeat';
import BaseAction from './base-action';
import { addNotification } from '../../../actions';
import { micropub } from '../../../modules/feathers-services';

const ActionRepost = ({ url, syndication, notification, menuItem }) => (
  <BaseAction
    title="Repost"
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
        .then(res => notification(`Successfully reposted ${url}`))
        .catch(err => notification(`Error reposting ${url}`, 'error'));
    }}
    icon={<RepostIcon />}
    menuItem={menuItem}
  />
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
