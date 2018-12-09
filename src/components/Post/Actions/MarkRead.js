import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReadIcon from '@material-ui/icons/PanoramaFishEye'
import UnreadIcon from '@material-ui/icons/Lens'
import BaseAction from './Base'
import { markPostRead, markPostUnread } from '../../../actions'

const ActionMarkRead = ({
  _id,
  isRead,
  channel,
  markPostRead,
  markPostUnread,
  menuItem,
}) => (
  <BaseAction
    title={'Mark as ' + (isRead ? 'Unread' : 'Read')}
    onClick={() =>
      isRead ? markPostUnread(channel, _id) : markPostRead(channel, _id)
    }
    icon={isRead ? <ReadIcon /> : <UnreadIcon />}
    menuItem={menuItem}
  />
)

const mapDispatchToProps = dispatch =>
  bindActionCreators({ markPostRead, markPostUnread }, dispatch)

export default connect(
  null,
  mapDispatchToProps
)(ActionMarkRead)
