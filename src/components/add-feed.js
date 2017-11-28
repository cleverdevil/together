import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { CircularProgress } from 'material-ui/Progress';
import AddIcon from 'material-ui-icons/Add';
import { LinearProgress } from 'material-ui/Progress';
import TogetherCard from './card';
import microsub from '../modules/microsub-api';
import { setUserOption } from '../actions';


const styles = theme => ({
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    right: 0,
    bottom: 0,
    width: 300,
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
    width: '100%',
  },
  results: {
    width: '100%',
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
  }
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
    e.preventDefault();
    this.setState({
      results: null,
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
    microsub('search', { params: [this.state.search] })
      .then((results) => {
        if (results.length < 1) {
          this.setState({
            loading: false,
            noResults: true,
          })
        } else {
          this.setState({
            loading: false,
            results: results,
          });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      })
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
      microsub('follow', { params: [feed, channel] })
        .then((res) => {
          alert('Followed. You will need to change channels and return to this channel to see the update');
        })
        .catch((err) => {
          console.log(err);
          alert('Error following');
        });
    } else {
      alert('Error following');
    }
  }

  getPreview(url) {
    this.setState({ loading: true });
    microsub('preview', { params: [url] })
      .then((preview) => {
        this.setState({
          preview: preview,
          loading: false,
        });
      })
      .catch((err) => console.log(err));
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
    if (!this.state.results || this.state.results.length === 0 || this.state.preview) {
      return null;
    }
    return (
      <Card className={this.props.classes.results}>
        <List>
          {this.state.results.map((result, i) => (
            <ListItem button onClick={() => this.handleResultSelect(result)} key={`search-result-${i}`}>
              <Avatar alt="" src={result.photo}>{result.photo ? null : result.url.replace('https://', '').replace('http://', '').replace('www.', '')[0]}</Avatar>
              <ListItemText primary={result.name || result.url} secondary={result.url} />
            </ListItem>
          ))}
          </List>
        <CardActions className={this.props.classes.fixedCardActions}>
          <Button dense onClick={this.handleCancel}>Cancel</Button>
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
              {this.state.selectedResult.photo ?
                null : this.state.selectedResult.url.replace('https://', '').replace('http://', '').replace('www.', '')[0]}
            </Avatar>
            <ListItemText
              primary={this.state.selectedResult.name || this.state.selectedResult.url}
              secondary={this.state.selectedResult.url}
            />
          </ListItem>
        )}
        {preview.items.map((item, i) => (
          <TogetherCard post={item} embedMode="photo" key={`search-preview-${i}`}/>
        ))}
        <CardActions className={this.props.classes.fixedCardActions}>
          <Button
            dense  
            color="primary"
            onClick={this.handleFollow}
          >
            Follow
          </Button>
          <Button dense onClick={() => this.setState({preview: null})}>Back to Results</Button>
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
        <form onSubmit={this.handleSearch} >
          <CardContent>
            <TextField
              required
              fullWidth
              autoFocus={true}
              type="search"
              label="Who / What do you want to add?"
              onChange={(e) => this.setState({search: e.target.value})}
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
          fab
          color="primary"
          aria-label="Add New Subscription"
          className={this.props.classes.fabButton}
          onClick={() => this.setState({searching: true})}
        >
          <AddIcon />
        </Button>
        {this.state.loading && <CircularProgress size={58} color="accent" className={this.props.classes.fabProgress} />}
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
  return bindActionCreators({
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddFeed));
