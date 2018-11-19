import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LikeIcon from '@material-ui/icons/ThumbUp'
import BaseAction from './Base'
import { addNotification } from '../../../actions'
import { micropub } from '../../../modules/feathers-services'

const ActionLike = ({ url, syndication, notification, menuItem }) => (
  <BaseAction
    title="Like"
    icon={<LikeIcon />}
    onClick={e => {
      const mf2 = {
        type: ['h-entry'],
        properties: {
          'like-of': [url],
        },
      }
      if (syndication.length) {
        mf2.properties['mp-syndicate-to'] = syndication
      }
      micropub
        .create({ post: mf2 })
        .then(res => notification(`Successfully liked ${url}`))
        .catch(err => notification(`Error liking ${url}`, 'error'))
    }}
    menuItem={menuItem}
  />
)

const mapStateToProps = state => ({
  syndication: state.settings.get('likeSyndication') || [],
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ notification: addNotification }, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionLike)
