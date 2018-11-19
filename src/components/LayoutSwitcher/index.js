import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { updateChannel } from '../../actions'
import layouts from '../../modules/layouts'
import getChannelSetting from '../../modules/get-channel-setting'
import styles from './style'

const LayoutSwitcher = ({
  classes,
  className,
  updateChannel,
  channelSettings,
  selectedChannel,
}) => (
  <div className={[classes.menu, className].join(' ')}>
    {layouts.map(layout => {
      const Icon = layout.icon
      return (
        <Tooltip
          title={layout.name}
          key={'layout-switcher-' + layout.id}
          placement="right"
        >
          <IconButton
            className={
              classes.icon +
              ' ' +
              (getChannelSetting(selectedChannel, 'layout', channelSettings) ===
              layout.id
                ? classes.iconSelected
                : '')
            }
            onClick={() => updateChannel(selectedChannel, 'layout', layout.id)}
          >
            <Icon />
          </IconButton>
        </Tooltip>
      )
    })}
  </div>
)

LayoutSwitcher.defaultProps = {
  channels: [],
}

LayoutSwitcher.propTypes = {
  channels: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  selectedChannel: state.app.get('selectedChannel'),
  channelSettings: state.settings.get('channels'),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateChannel: updateChannel,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LayoutSwitcher))
