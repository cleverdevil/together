import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import TogetherCard from './card/index';
import {
  search as searchService,
  follows as followService,
} from '../modules/feathers-services';
import { addNotification, selectChannel } from '../actions';

const styles = theme => ({
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    right: 0,
    bottom: 0,
    padding: 10,
    maxWidth: 'calc(100vw - 90px)',
    maxHeight: '100vh',
  },
  fabButton: {
    width: 56,
    height: 56,
  },
  search: {
    marginBottom: 10,
    width: 320,
    maxWidth: '100%',
  },
  results: {
    width: 320,
    maxWidth: '100%',
    marginTop: 10,
    marginBottom: 10,
    maxHeight: 'calc(100vh - 240px)',
    overflow: 'auto',
  },
  fabProgress: {
    position: 'absolute',
    bottom: 10 - 1,
    right: 10 - 1,
    pointerEvents: 'none',
  },
  fixedCardActions: {
    background: theme.palette.background.paper,
    borderTop: '1px solid ' + theme.palette.text.disabled,
    position: 'sticky',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 9999, // To appear on top of maps
  },
});

class AddFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      searching: false,
      loading: false,
      preview: null,
      results: [],
    };
    this.renderSearch = this.renderSearch.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.getPreview = this.getPreview.bind(this);
  }

  handleCancel(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    this.setState({
      results: [],
      search: null,
      searching: false,
      preview: false,
      loading: false,
    });
    return false;
  }

  handleSearch(e) {
    e.preventDefault();
    this.setState({
      loading: true,
      noResults: false,
      preview: false,
      results: [],
    });
    searchService
      .find({ query: { search: this.state.search } })
      .then(results => {
        if (results.length < 1) {
          this.setState({
            loading: false,
            noResults: true,
          });
        } else {
          this.setState({
            loading: false,
            results: results,
          });
        }
      })
      .catch(err => {
        this.setState({ loading: false });
        console.log(err);
      });
    return false;
  }

  handleResultSelect(result) {
    this.setState({
      selectedResult: result,
    });
    this.getPreview(result.url);
  }

  handleFollow(e) {
    e.preventDefault();
    let feed = false;
    if (this.state.selectedResult && this.state.selectedResult.url) {
      feed = this.state.selectedResult.url;
    }
    const channel = this.props.currentChannel;
    if (feed && channel) {
      followService
        .create({
          url: feed,
          channel: channel,
        })
        .then(res => {
          this.props.addNotification(`Added ${feed} to your channel`);
          this.handleCancel();
          // Wait one second and reload the channel to see if the new posts are there.
          setTimeout(() => {
            this.props.selectChannel(null);
            this.props.selectChannel(channel);
          }, 1000);
        })
        .catch(err => {
          console.log(err);
          this.props.addNotification(`Error following ${feed}`, 'error');
        });
    } else {
      this.props.addNotification('Error following', 'error');
    }
  }

  getPreview(url) {
    this.setState({ loading: true });
    searchService
      .get(url)
      .then(preview => {
        this.setState({
          preview: preview,
          loading: false,
        });
      })
      .catch(err => console.log(err));
  }

  renderResults() {
    if (this.state.noResults) {
      return (
        <Card className={this.props.classes.results}>
          <ListItem>
            <ListItemText primary="No results" secondary="Please try again" />
          </ListItem>
        </Card>
      );
    }
    if (
      !this.state.results ||
      this.state.results.length === 0 ||
      this.state.preview
    ) {
      return null;
    }
    return (
      <Card className={this.props.classes.results}>
        <List>
          {this.state.results.map((result, i) => (
            <ListItem
              button
              onClick={() => this.handleResultSelect(result)}
              key={`search-result-${i}`}
            >
              <Avatar alt="" src={result.photo}>
                {result.photo
                  ? null
                  : result.url
                      .replace('https://', '')
                      .replace('http://', '')
                      .replace('www.', '')[0]}
              </Avatar>
              <ListItemText
                primary={result.name || result.url}
                secondary={result.url}
              />
            </ListItem>
          ))}
        </List>
        <CardActions className={this.props.classes.fixedCardActions}>
          <Button dense onClick={this.handleCancel}>
            Cancel
          </Button>
        </CardActions>
      </Card>
    );
  }

  renderPreview() {
    if (!this.state.preview) {
      return null;
    }
    const preview = this.state.preview;
    return (
      <Card className={this.props.classes.results}>
        {this.state.selectedResult && (
          <ListItem>
            <Avatar alt="" src={this.state.selectedResult.photo}>
              {this.state.selectedResult.photo
                ? null
                : this.state.selectedResult.url
                    .replace('https://', '')
                    .replace('http://', '')
                    .replace('www.', '')[0]}
            </Avatar>
            <ListItemText
              primary={
                this.state.selectedResult.name || this.state.selectedResult.url
              }
              secondary={this.state.selectedResult.url}
            />
          </ListItem>
        )}
        {preview.items.map((item, i) => (
          <TogetherCard
            post={item}
            style={{ boxShadow: 'none' }}
            key={`search-preview-${i}`}
          />
        ))}
        <CardActions className={this.props.classes.fixedCardActions}>
          <Button dense color="primary" onClick={this.handleFollow}>
            Follow
          </Button>
          <Button dense onClick={() => this.setState({ preview: null })}>
            Back to Results
          </Button>
        </CardActions>
      </Card>
    );
  }

  renderSearch() {
    if (!this.state.searching) {
      return null;
    }
    return (
      <Card className={this.props.classes.search}>
        <form onSubmit={this.handleSearch}>
          <CardContent>
            <TextField
              required
              fullWidth
              autoFocus={true}
              type="search"
              label="Who / What do you want to add?"
              onChange={e => this.setState({ search: e.target.value })}
            />
          </CardContent>
          <CardActions>
            <Button dense color="primary" type="submit">
              Search
            </Button>
            <Button dense onClick={this.handleCancel}>
              Cancel
            </Button>
          </CardActions>
        </form>
      </Card>
    );
  }

  render() {
    if (!this.props.currentChannel) {
      return null;
    }
    return (
      <div className={this.props.classes.container}>
        {this.renderSearch()}
        {this.renderResults()}
        {this.renderPreview()}
        <Button
          variant="fab"
          color="secondary"
          aria-label="Add New Subscription"
          className={this.props.classes.fabButton}
          onClick={() => this.setState({ searching: true })}
        >
          <AddIcon />
        </Button>
        {this.state.loading && (
          <CircularProgress
            size={58}
            color="accent"
            className={this.props.classes.fabProgress}
          />
        )}
      </div>
    );
  }
}

AddFeed.defaultProps = {
  currentChannel: false,
};

function mapStateToProps(state, props) {
  return {
    currentChannel: state.app.get('selectedChannel'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addNotification: addNotification,
      selectChannel: selectChannel,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(AddFeed));
