import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReplyIcon from '@material-ui/icons/Reply';
import Popover from '@material-ui/core/Popover';
import BaseAction from './base-action';
import MicropubForm from '../../micropub-form';
import { addNotification } from '../../../actions';
import { micropub } from '../../../modules/feathers-services';

class ActionReply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
    };
    this.handleReply = this.handleReply.bind(this);
    this.handleReplySend = this.handleReplySend.bind(this);
  }

  handleReply(e) {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
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
    const { url, menuItem } = this.props;
    return (
      <React.Fragment>
        <BaseAction
          title="Reply"
          onClick={this.handleReply}
          icon={<ReplyIcon />}
          menuItem={menuItem}
        />
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
