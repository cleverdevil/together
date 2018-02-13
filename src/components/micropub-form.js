import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
// import { Link } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import SendIcon from 'material-ui-icons/Send';
// import {} from '../actions';

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
  constructor(props) {
    super(props);

    this.state = {
      shownFields: {},
    };
    propertyKeys.forEach(key => {
      if (this.props[key]) {
        this.state[key] = this.props[key];
      }
    });
    props.shownFields.forEach(key => (this.state.shownFields[key] = true));

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    let micropub = {
      type: ['h-entry'],
      properties: {},
    };
    propertyKeys.forEach(key => {
      if (this.state[key]) {
        let value = this.state[key];
        if (!Array.isArray(value)) {
          value = [value];
        }
        micropub.properties[key] = value;
      }
    });
    this.props.onSubmit(micropub);
  }

  render() {
    const shownFields = this.state.shownFields;
    return (
      <form
        className={this.props.classes.container}
        onSubmit={this.handleSubmit}
      >
        {shownFields.content && (
          <TextField
            id="micropub-form-content"
            label="Content"
            fullWidth={true}
            className={this.props.classes.input}
            value={this.state.content}
            onChange={this.handleChange('content')}
            margin="normal"
            multiline={true}
            rows={2}
          />
        )}
        <Button
          raised
          color="primary"
          type="submit"
          className={this.props.classes.submitButton}
        >
          Send <SendIcon className={this.props.classes.submitButtonIcon} />
        </Button>
      </form>
    );
  }
}

MicropubForm.defaultProps = {
  content: '',
  shownFields: ['content'],
};

MicropubForm.propTypes = {
  shownFields: PropTypes.array.isRequired,
  content: PropTypes.string,
  onSubmit: PropTypes.func,
};

function mapStateToProps(state, props) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(MicropubForm),
);
