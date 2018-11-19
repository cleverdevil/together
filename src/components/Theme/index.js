import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './style'

class Theme extends Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: theme(props.theme),
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.theme !== this.props.theme) {
      this.setState({ theme: theme(newProps.theme) })
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={this.state.theme}>
        {this.props.children}
      </MuiThemeProvider>
    )
  }
}

Theme.defaultProps = {
  theme: 'light',
}

Theme.propTypes = {
  theme: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  theme: state.app.get('theme'),
})

export default connect(mapStateToProps)(Theme)
