import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import MicropubForm from './micropub-form';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { micropub } from '../modules/feathers-services';
import { addNotification } from '../actions';

const styles = theme => ({
  wrapper: {
    height: '100%',
    overflow: 'auto',
  },
  container: {
    padding: theme.spacing.unit * 3,
    maxWidth: 800,
  },
});

class FullMicropubEditor extends React.Component {
  static micropub = null;

  constructor(props) {
    super(props);

    const state = {};

    if (
      props.location &&
      props.location.state &&
      props.location.state.properties
    ) {
      state.properties = props.location.state.properties;
    }

    this.state = state;

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(mf2) {
    micropub
      .create({ post: mf2 })
      .then(url => {
        this.props.addNotification(`Successfully posted to ${url}`);
        this.props.history.goBack();
      })
      .catch(err => this.props.addNotification(`Error posting`, 'error'));
  }

  render() {
    const { classes } = this.props;
    const { properties } = this.state;
    const shownProperties = [
      'name',
      'content',
      ...Object.keys(properties || {}),
    ];
    return (
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <MicropubForm
            expanded={true}
            properties={properties}
            shownProperties={shownProperties}
            onSubmit={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}

FullMicropubEditor.defaultProps = {};

FullMicropubEditor.propTypes = {};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ addNotification }, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(withStyles(styles)(FullMicropubEditor));
