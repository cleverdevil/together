import React from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import PhotoIcon from 'material-ui-icons/PhotoCamera';
import AudioIcon from 'material-ui-icons/Headset';
import CheckinIcon from 'material-ui-icons/LocationOn';
import ArticleIcon from 'material-ui-icons/LibraryBooks';
import NoteIcon from 'material-ui-icons/Chat';
import AllIcon from 'material-ui-icons/Home';

const styles = theme => ({
  paperAnchorDockedLeft: {
    overflow: 'visible',
    background: theme.palette.shades.dark.background.appBar,
  },
  icon: {
    color: theme.palette.shades.dark.text.icon,
  }
});

class PostKindMenu extends React.Component {
  render() {
    const postKinds = [
      {
        id: 'all',
        name: 'All',
        icon: <AllIcon className={this.props.classes.icon} />,
      },
      {
        id: 'note',
        name: 'Notes',
        icon: <NoteIcon className={this.props.classes.icon} />,
      },
      {
        id: 'photo',
        name: 'Photos',
        icon: <PhotoIcon className={this.props.classes.icon} />,
      },
      {
        id: 'post',
        name: 'Articles',
        icon: <ArticleIcon className={this.props.classes.icon} />,
      },
      {
        id: 'audio',
        name: 'Podcasts & Music',
        icon: <AudioIcon className={this.props.classes.icon} />,
      },
      {
        id: 'checkins',
        name: 'Checkins',
        icon: <CheckinIcon className={this.props.classes.icon} />,
      },
    ];

    return (
      <Drawer
        type="permanent"
        classes={{
          paperAnchorDockedLeft: this.props.classes.paperAnchorDockedLeft,
        }}
      >
        {postKinds.map((postKind) => (
          <Tooltip title={postKind.name} key={'post-kind-menu-' + postKind.id} placement="right">
            <IconButton>
              {postKind.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Drawer>
    );
  }
}

PostKindMenu.defaultProps = {};

PostKindMenu.propTypes = {};

export default withStyles(styles)(PostKindMenu);
