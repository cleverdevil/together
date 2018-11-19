import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import AddIcon from '@material-ui/icons/Add'
import Search from './Search'
import Preview from './Preview'
import Results from './Results'
import {
  search as searchService,
  follows as followService,
} from '../../modules/feathers-services'
import { addNotification, selectChannel } from '../../actions'
import styles from './style'

class AddFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searching: false,
      loading: false,
      preview: null,
      results: null,
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleResultSelect = this.handleResultSelect.bind(this)
    this.handleFollow = this.handleFollow.bind(this)
    this.getPreview = this.getPreview.bind(this)
  }

  handleCancel(e) {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    this.setState({
      results: null,
      searching: false,
      preview: false,
      loading: false,
    })
    return false
  }

  handleResultSelect(result) {
    this.setState({
      selectedResult: result,
    })
    this.getPreview(result.url)
  }

  handleFollow(e) {
    e.preventDefault()
    let feed = false
    if (this.state.selectedResult && this.state.selectedResult.url) {
      feed = this.state.selectedResult.url
    }
    const channel = this.props.currentChannel
    if (feed && channel) {
      followService
        .create({
          url: feed,
          channel: channel,
        })
        .then(res => {
          this.props.addNotification(`Added ${feed} to your channel`)
          this.handleCancel()
          // Wait one second and reload the channel to see if the new posts are there.
          setTimeout(() => {
            this.props.selectChannel(null)
            this.props.selectChannel(channel)
          }, 1000)
        })
        .catch(err => {
          console.log(err)
          this.props.addNotification(`Error following ${feed}`, 'error')
        })
    } else {
      this.props.addNotification('Error following', 'error')
    }
  }

  getPreview(url) {
    this.setState({ loading: true })
    searchService
      .get(url)
      .then(preview => {
        this.setState({
          preview: preview,
          loading: false,
        })
      })
      .catch(err => console.log(err))
  }

  handleSearch(search) {
    this.setState({
      loading: true,
      preview: null,
      results: null,
    })
    searchService
      .find({ query: { search } })
      .then(results =>
        this.setState({
          loading: false,
          results: results,
        })
      )
      .catch(err => {
        this.setState({ loading: false })
        console.log(err)
      })
    return false
  }

  render() {
    const { currentChannel, classes } = this.props
    const { searching, preview, results, selectedResult } = this.state

    if (!currentChannel) {
      return null
    }

    let currentElement = null
    if (preview !== null && preview.items) {
      currentElement = 'preview'
    } else if (results !== null) {
      currentElement = 'results'
    } else if (searching) {
      currentElement = 'search'
    }

    return (
      <div className={classes.container}>
        {currentElement === 'search' && (
          <Search
            handleSearch={this.handleSearch}
            handleCancel={this.handleCancel}
          />
        )}
        {currentElement === 'preview' && (
          <Preview
            items={preview.items}
            selectedResult={selectedResult}
            handleFollow={this.handleFollow}
            handleBack={() => this.setState({ preview: null })}
          />
        )}
        {currentElement === 'results' && (
          <Results
            results={results}
            handleCancel={this.handleCancel}
            handleResultSelect={this.handleResultSelect}
          />
        )}
        <Button
          variant="fab"
          color="secondary"
          aria-label="Add New Subscription"
          className={classes.fabButton}
          onClick={() => this.setState({ searching: true })}
        >
          <AddIcon />
        </Button>
        {this.state.loading && (
          <CircularProgress
            size={58}
            style={{ color: 'rgba(255,255,255,.2)' }}
            color="inherit"
            className={classes.fabProgress}
          />
        )}
      </div>
    )
  }
}

AddFeed.defaultProps = {
  currentChannel: false,
}

const mapStateToProps = state => ({
  currentChannel: state.app.get('selectedChannel'),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addNotification: addNotification,
      selectChannel: selectChannel,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddFeed))
