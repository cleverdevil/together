import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import { Editor } from 'react-draft-wysiwyg';
import TextField from '@material-ui/core/TextField';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';



const styles = theme => ({
  container: {
    display: 'block',
    overflow: 'hidden',
  },
  input: {
  },
  submitButton: {
    float: 'right',
    'margin-top': '5em'
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

class MicropubComposer extends React.Component {
  constructor(props) {
    super(props);

    let shownFields = {};
    props.shownFields.forEach(key => (shownFields[key] = true));

    let stateKeys = {};
    propertyKeys.forEach(key => {
      if (props[key]) {
        stateKeys[key] = props[key];
      }
    });

    this.state = {
      shownFields: shownFields,
      ...stateKeys,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = name => event => {
    if (name == 'title') {
        this.setState({
            [name]: event.target.value,
        });
    } else if (name == 'content') {
        let content = event;
        this.setState({
            content
        });
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    let content = draftToHtml(this.state.content);
    
    let micropub = {
      type: ['h-entry'],
      properties: {
        'name': [this.state.title],
        'content': [{
            'html': content
        }]
      }
    };
    
    this.props.onSubmit(micropub);
  }

  render() {
    const shownFields = this.state.shownFields;
    return (
      <form
        className={this.props.classes.container}
        onSubmit={this.handleSubmit}
      >
        {shownFields.title && (
            <TextField
              id="micropub-composer-title"
              label="Title"
              fullWidth={true}
              className={this.props.classes.title}
              value={this.state.title}
              onChange={this.handleChange('title')}
              margin="normal"
              multiline={false}
            />
        )}
        {shownFields.content && (
            <Editor 
              id="micropub-composer-content"
              label="Content"
              fullWidth={true}
              className={this.props.classes.content}
              value={this.state.content}
              onContentStateChange={this.handleChange('content')}
            />
        )}
        <Button
          variant="raised"
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

MicropubComposer.defaultProps = {
  title: '',
  content: '',
  shownFields: ['content', 'title'],
};

MicropubComposer.propTypes = {
  shownFields: PropTypes.array.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(MicropubComposer);
