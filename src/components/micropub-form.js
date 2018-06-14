import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MicropubEditor from 'micropub-client-editor';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

const styles = theme => ({
  container: {
    display: 'block',
    overflow: 'hidden',
  },
  input: {},
  submitButton: {
    float: 'right',
  },
  submitButtonIcon: {
    marginLeft: '.5em',
  },
});

const propertyKeys = [
  'content',
  'in-reply-to',
  'like-of',
  'bookmark-of',
  'name',
  'category',
  'photo',
];

class MicropubForm extends React.Component {
  static micropub = null;

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(micropub) {
    console.log(micropub);
    this.micropub = micropub;
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.onSubmit();
  }

  render() {
    const { classes, shownProperties, properties } = this.props;
    return (
      <form className={classes.container} onSubmit={this.handleSubmit}>
        <MicropubEditor
          richContent={false}
          properties={properties}
          shownProperties={shownProperties}
          buttonComponent={Button}
          inputComponent={props => <Input fullWidth={true} {...props} />}
          textareaComponent={props => (
            <Input fullWidth={true} multiline={true} {...props} rows={3} />
          )}
          labelComponent={
            shownProperties.lenth > 1
              ? props => <InputLabel style={{ marginBottom: 10 }} {...props} />
              : () => null
          }
          onChange={this.handleChange}
        />
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
  content: '',
  shownProperties: ['content'],
};

MicropubForm.propTypes = {
  shownProperties: PropTypes.array.isRequired,
  content: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  properties: PropTypes.object,
};

export default withStyles(styles)(MicropubForm);
