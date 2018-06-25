import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ReplyIcon from '@material-ui/icons/Reply';
import Popover from '@material-ui/core/Popover';
import MicropubForm from '../../micropub-form';
import { addNotification } from '../../../actions';
import { micropub } from '../../../modules/feathers-services';

class ActionReply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
    };
  }

  handleReply(e) {
    this.setState({
      popoverOpen: true,
      popoverAnchor: e.target,
    });
  }

  handleReplySend(mf2) {
    micropub
      .create({ post: mf2 })
      .then(replyUrl => {
        this.setState({ popoverOpen: false });
        this.props.notification(`Successfully posted reply to ${replyUrl}`);
      })
      .catch(err => this.props.notification(`Error posting reply`, 'error'));
  }

  render() {
    const { url, syndication, notification } = this.props;
    return (
      <React.Fragment>
        <Tooltip title="Reply" placement="top">
          <IconButton
            onClick={() =>
              this.setState({ popoverOpen: !this.state.popoverOpen })
            }
          >
            <ReplyIcon />
          </IconButton>
        </Tooltip>
        <Popover
          open={this.state.popoverOpen}
          anchorEl={this.state.popoverAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={() => this.setState({ popoverOpen: false })}
          onBackdropClick={() => this.setState({ popoverOpen: false })}
        >
          <div
            style={{
              padding: 10,
            }}
          >
            <MicropubForm
              onSubmit={this.handleReplySend}
              properties={{ 'in-reply-to': url }}
            />
          </div>
        </Popover>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  syndication: state.settings.get('likeSyndication') || [],
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ notification: addNotification }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionReply);
