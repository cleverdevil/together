import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import SettingsIcon from 'material-ui-icons/Settings';
import ChannelsIcon from 'material-ui-icons/Menu';
import { selectPostKind, toggleChannelsMenu } from '../actions';


const styles = theme => ({
  paperAnchorDockedLeft: {
    overflow: 'visible',
    background: theme.palette.shades.dark.background.appBar,
  },
  icon: {
    color: theme.palette.shades.dark.text.icon,
    '&:hover': {
      color: theme.palette.secondary['200'],
    }
  },
  iconSelected: {
    color: theme.palette.secondary['500'],
    '&:hover': {
      color: theme.palette.secondary['500'],
    }
  }
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
      <Drawer
        type="permanent"
        classes={{
          paperAnchorDockedLeft: this.props.classes.paperAnchorDockedLeft,
        }}
      >
        {this.props.postKinds.map((postKind) => {
          const Icon = postKind.icon;
          return (
            <Tooltip title={postKind.name} key={'post-kind-menu-' + postKind.id} placement="right">
              <IconButton
                className={this.props.classes.icon + ' ' + (postKind.selected ? this.props.classes.iconSelected : '')}
                onClick={() => this.handleClick(postKind)}
              >
                <Icon />
              </IconButton>
            </Tooltip>
          );
        })}
        <div style={{ flexGrow: 1 }}></div>
        <Tooltip title="Channels" placement="right">
          <IconButton
            className={this.props.classes.icon}
            onClick={this.props.toggleChannelsMenu}
          >
            <ChannelsIcon />
          </IconButton>
        </Tooltip>
        <Link to="/settings">
          <Tooltip title="Settings" placement="right">
            <IconButton
              className={this.props.classes.icon}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Link>
      </Drawer>
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
  return bindActionCreators({
    selectPostKind: selectPostKind,
    toggleChannelsMenu: toggleChannelsMenu,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PostKindMenu));
