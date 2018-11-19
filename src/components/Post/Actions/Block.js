import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import BlockIcon from '@material-ui/icons/Block'
import BaseAction from './Base'
import { addNotification, removePost } from '../../../actions'
import { posts as postsService } from '../../../modules/feathers-services'

const ActionBlock = ({
  _id,
  url,
  notification,
  removePost,
  channel,
  menuItem,
}) => (
  <BaseAction
    title={'Block user'}
    onClick={() => {
      postsService
        .update(url, {
          channel,
          block: url,
        })
        .then(res => {
          removePost(_id)
          notification('User blocked')
        })
        .catch(err => {
          console.log('Error blocking user', err)
          notification('Error blocking user', 'error')
        })
    }}
    icon={<BlockIcon />}
    menuItem={menuItem}
  />
)

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      notification: addNotification,
      removePost,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionBlock)
