import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import MicropubEditor from 'micropub-client-editor';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import SendIcon from '@material-ui/icons/Send';

const styles = theme => ({
  container: {
    display: 'block',
    overflow: 'hidden',
    minWidth: 300,
    maxWidth: '100%',
  },
  expandedContainer: {
    width: '100%',
  },
  submitButton: {
    float: 'right',
  },
  submitButtonIcon: {
    marginLeft: '.5em',
  },
});

class MicropubForm extends React.Component {
  static micropub = null;

  constructor(props) {
    super(props);

    this.state = {
      expanded: props.expanded,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openFullEditor = this.openFullEditor.bind(this);
  }

  handleChange(micropub) {
    // Don't want to set this to a state because it will cause too many updates
    this.micropub = micropub;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.micropub);
  }

  openFullEditor() {
    let editorState = null;
    if (this.micropub) {
      editorState = { properties: this.micropub.properties };
    }
    this.props.history.push('/editor', editorState);
  }

  render() {
    const { expanded } = this.state;
    const {
      classes,
      shownProperties,
      properties,
      syndicationProviders,
    } = this.props;
    const formShownProperties = [...shownProperties];
    let formProperties = properties;
    if (expanded) {
      formShownProperties.push('mp-slug', 'visibility', 'post-status');
    }
    if (this.props.mpSyndicateTo && this.props.mpSyndicateTo.length) {
      if (!formProperties) {
        formProperties = {};
      }
      formProperties['mp-syndicate-to'] = this.props.mpSyndicateTo;
      if (expanded) {
        formShownProperties.push('mp-syndicate-to');
      }
    }
    return (
      <form
        className={
          expanded
            ? [classes.expandedContainer, classes.container].join(' ')
            : classes.container
        }
        onSubmit={this.handleSubmit}
      >
        <MicropubEditor
          richContent={expanded}
          properties={formProperties}
          shownProperties={formShownProperties}
          buttonComponent={Button}
          inputComponent={props => <Input fullWidth={true} {...props} />}
          textareaComponent={props => (
            <Input fullWidth={true} multiline={true} {...props} rows={3} />
          )}
          labelComponent={props => (
            <InputLabel
              {...props}
              style={{ marginBottom: 10, display: 'block' }}
            />
          )}
          checkboxComponent={props => (
            <React.Fragment>
              <Checkbox {...props} />
              <span style={{ width: 10, display: 'inline-block' }} />
            </React.Fragment>
          )}
          selectComponent={props => <Select fullWidth="true" {...props} />}
          syndication={syndicationProviders}
          onChange={this.handleChange}
        />
        {!expanded && (
          <Button onClick={this.openFullEditor}>Full Editor</Button>
        )}
        <Button
          variant="raised"
          color="primary"
          type="submit"
          className={classes.submitButton}
        >
          Send <SendIcon className={classes.submitButtonIcon} />
        </Button>
      </form>
    );
  }
}

MicropubForm.defaultProps = {
  expanded: false,
  shownProperties: ['content'],
};

MicropubForm.propTypes = {
  expanded: PropTypes.bool.isRequired,
  shownProperties: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  properties: PropTypes.object,
};

const mapStateToProps = state => ({
  syndicationProviders: state.settings.get('syndicationProviders'),
  mpSyndicateTo: state.settings.get('noteSyndication'),
});

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(MicropubForm)),
);
