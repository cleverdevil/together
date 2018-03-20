import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
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

class LayoutSwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(layout) {
    this.props.updateChannel(this.props.selectedChannel, 'layout', layout.id);
  }

  render() {
    const uid = this.props.selectedChannel;
    const currentLayout = getChannelSetting(
      uid,
      'layout',
      this.props.channelSettings,
    );

    return (
      <div
        className={[this.props.classes.menu, this.props.className].join(' ')}
      >
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
                  this.props.classes.icon +
                  ' ' +
                  (currentLayout == layout.id
                    ? this.props.classes.iconSelected
                    : '')
                }
                onClick={() => this.handleClick(layout)}
              >
                <Icon />
              </IconButton>
            </Tooltip>
          );
        })}
      </div>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(LayoutSwitcher),
);
