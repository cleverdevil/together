import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import RemoveIcon from '@material-ui/icons/Delete'
import BaseAction from './Base'
import { removePost } from '../../../actions'

const ActionRemove = ({ _id, removePost, channel, menuItem }) => (
  <BaseAction
    title={'Remove from channel'}
    onClick={() => removePost(channel, _id)}
    icon={<RemoveIcon />}
    menuItem={menuItem}
  />
)

const mapDispatchToProps = dispatch =>
  bindActionCreators({ removePost }, dispatch)

export default connect(
  null,
  mapDispatchToProps
)(ActionRemove)
