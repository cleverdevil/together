import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import { selectPostKind } from '../actions';

const styles = theme => ({
  menu: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    background: theme.palette.primary.main,
  },
  icon: {
    color: theme.palette.primary.dark,
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
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(PostKindMenu),
);
