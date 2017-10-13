import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
// import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { selectChannel, toggleChannelsMenu } from '../actions';


const styles = theme => ({
  drawer: {
    width: 200,
    background: theme.palette.shades.dark.background.appBar,
  },
  button: {
    textAlign: 'left',
    color: theme.palette.shades.dark.text.icon,
  },
  // iconSelected: {
  //   color: theme.palette.secondary['500'],
  //   '&:hover': {
  //     color: theme.palette.secondary['500'],
  //   }
  // }
});

class ChannelMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(channel) {
    
  }

  render() {
    return (
      <Drawer
        open={this.props.open}
        onRequestClose={this.props.toggleChannelsMenu}
        classes={{
          paperAnchorLeft: this.props.classes.drawer,
        }}
      >
        <List>
          {this.props.channels.map((channel) => {
            return (
              <ListItem
                key={`channel-${channel.uid}`}
                onClick={() => this.props.selectChannel(channel.uid)}
                button
              >
                <ListItemText
                  classes={{ text: this.props.classes.button }}
                  primary={channel.name}
                />
              </ListItem>
            );
          })}
        </List>  
      </Drawer>
    );
  }
}

ChannelMenu.defaultProps = {
  open: false,
};

ChannelMenu.propTypes = {
  channels: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  return {
    channels: state.channels.toJS(),
    open: state.app.get('channelsMenuOpen'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectChannel: selectChannel,
    toggleChannelsMenu: toggleChannelsMenu,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChannelMenu));
