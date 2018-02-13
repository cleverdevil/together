import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import SettingsIcon from 'material-ui-icons/Settings';
import ChannelsIcon from 'material-ui-icons/Menu';
import { selectPostKind, toggleChannelsMenu } from '../actions';

const styles = theme => ({
  menu: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    background: theme.palette.shades.dark.background.default,
  },
  icon: {
    color: theme.palette.shades.dark.text.icon,
    '&:hover': {
      color: theme.palette.secondary['200'],
    },
  },
  iconSelected: {
    color: theme.palette.secondary['500'],
    '&:hover': {
      color: theme.palette.secondary['500'],
    },
  },
  channelMenuToggle: {
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
});

class PostKindMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(postKind) {
    if (!postKind.selected) {
      this.props.selectPostKind(postKind.id);
    }
  }

  render() {
    return (
      <div className={this.props.classes.menu}>
        {this.props.postKinds.map(postKind => {
          const Icon = postKind.icon;
          return (
            <Tooltip
              title={postKind.name}
              key={'post-kind-menu-' + postKind.id}
              placement="right"
            >
              <IconButton
                className={
                  this.props.classes.icon +
                  ' ' +
                  (postKind.selected ? this.props.classes.iconSelected : '')
                }
                onClick={() => this.handleClick(postKind)}
              >
                <Icon />
              </IconButton>
            </Tooltip>
          );
        })}
        <div style={{ flexGrow: 1 }} />
        <Tooltip
          title="Channels"
          placement="right"
          className={this.props.classes.channelMenuToggle}
        >
          <IconButton
            className={this.props.classes.icon}
            onClick={this.props.toggleChannelsMenu}
          >
            <ChannelsIcon />
          </IconButton>
        </Tooltip>
        <Link to="/settings">
          <Tooltip title="Settings" placement="right">
            <IconButton className={this.props.classes.icon}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    );
  }
}

PostKindMenu.defaultProps = {};

PostKindMenu.propTypes = {
  postKinds: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  return {
    postKinds: state.postKinds.toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectPostKind: selectPostKind,
      toggleChannelsMenu: toggleChannelsMenu,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(PostKindMenu),
);
