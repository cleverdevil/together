import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import Card, {
  CardHeader,
  CardActions,
  CardContent,
  CardMedia,
} from 'material-ui/Card';
import { GridList, GridListTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import moment from 'moment';
import authorToAvatarData from '../modules/author-to-avatar-data';

const styles = theme => ({});

class TogetherCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      read: props.post._is_read,
    };
    this.handleClick = this.handleClick.bind(this);
    this.getPreviewText = this.getPreviewText.bind(this);
  }

  handleClick() {
    if (this.props.onClick) {
      this.props.onClick();
      this.setState({ read: true });
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
    if (this.state.read) {
      readStyle.opacity = 0.5;
    }

    return (
      <ListItem dense button onClick={this.handleClick} style={readStyle}>
        <Avatar {...avatarData} aria-label={avatarData.alt}>
          {avatarData.src ? null : avatarData.initials}
        </Avatar>
        <ListItemText primary={this.getPreviewText()} secondary={date} />
      </ListItem>
    );
  }
}

TogetherCard.defaultProps = {
  post: {},
  embedMode: '',
};

TogetherCard.propTypes = {
  post: PropTypes.object.isRequired,
  embedMode: PropTypes.string,
};

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({

//   }, dispatch);
// }

// export default connect(null, mapDispatchToProps)(withStyles(styles)(TogetherCard));
export default withStyles(styles)(TogetherCard);
