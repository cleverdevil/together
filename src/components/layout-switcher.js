import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { updateChannel } from '../actions';
import layouts from '../modules/layouts';
import getChannelSetting from '../modules/get-channel-setting';

const styles = theme => ({
  menu: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    background: theme.palette.primary.main,
    color: theme.palette.primary.dark,
  },
  icon: {
    color: 'inherit',
    '&:hover': {
      color: theme.palette.primary.contrastText,
    },
  },
  iconSelected: {
    color: theme.palette.primary.contrastText,
    '&:hover': {
      color: theme.palette.primary.contrastText,
    },
  },
});

const LayoutSwitcher = ({
  classes,
  className,
  updateChannel,
  channelSettings,
  selectedChannel,
}) => (
  <div className={[classes.menu, className].join(' ')}>
    {layouts.map(layout => {
      const Icon = layout.icon;
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
              (getChannelSetting(selectedChannel, 'layout', channelSettings) ==
              layout.id
                ? classes.iconSelected
                : '')
            }
            onClick={() => updateChannel(selectedChannel, 'layout', layout.id)}
          >
            <Icon />
          </IconButton>
        </Tooltip>
      );
    })}
  </div>
);

LayoutSwitcher.defaultProps = {
  channels: [],
};

LayoutSwitcher.propTypes = {
  channels: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  return {
    selectedChannel: state.app.get('selectedChannel'),
    channelSettings: state.settings.get('channels'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateChannel: updateChannel,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(LayoutSwitcher));
