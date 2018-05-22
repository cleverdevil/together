import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment';
import authorToAvatarData from '../modules/author-to-avatar-data';

const styles = theme => ({});

class CompressedTogetherCard extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.getPreviewText = this.getPreviewText.bind(this);
  }

  handleClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  getPreviewText(maxLength = 80) {
    const item = this.props.post;
    let text = '';

    if (item.name) {
      text = item.name;
    } else if (item.summary) {
      text = item.summary;
    } else if (item.content) {
      const contentObject = item.content;
      if (contentObject.value) {
        text = contentObject.value;
      } else if (contentObject.html) {
        text = contentObject.html.replace(/<\/?[^>]+(>|$)/g, '');
      }
    }

    if (text.length > maxLength) {
      text = text.substring(0, maxLength);
      text += '…';
    }

    return text;
  }

  render() {
    const item = this.props.post;

    // Parse author data
    const avatarData = authorToAvatarData(item.author);

    // Parse published date
    let date = 'unknown';
    if (item.published) {
      date = moment(item.published).fromNow();
    }

    let readStyle = {};
    if (item._is_read) {
      readStyle.opacity = 0.5;
    }

    return (
      <ListItem dense button onClick={this.handleClick} style={readStyle}>
        <Avatar
          {...avatarData}
          aria-label={avatarData.alt}
          style={{ background: avatarData.color }}
        >
          {avatarData.src ? null : avatarData.initials}
        </Avatar>
        <ListItemText primary={this.getPreviewText()} secondary={date} />
      </ListItem>
    );
  }
}

CompressedTogetherCard.defaultProps = {
  post: {},
  embedMode: '',
};

CompressedTogetherCard.propTypes = {
  post: PropTypes.object.isRequired,
  embedMode: PropTypes.string,
};

export default withStyles(styles)(CompressedTogetherCard);
