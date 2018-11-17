import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = type => {
  const dark = type === 'dark' ? true : false;
  return createMuiTheme({
    typography: {
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
      fontWeightLight: 400,
      fontWeightRegular: 400,
      fontWeightMedium: 900,
    },
    palette: {
      type: type,
      primary: {
        light: dark ? '#222' : '#5e92f3',
        main: dark ? '#111' : '#1565c0',
        dark: dark ? '#000000' : '#003c8f',
        contrastText: dark ? '#fff' : '#fff',
      },
      secondary: {
        light: dark ? '#5e92f3' : '#5472d3',
        main: dark ? '#1565c0' : '#0d47a1',
        dark: dark ? '#003c8f' : '#002171',
        contrastText: dark ? '#fff' : '#fff',
      },
      background: {
        paper: dark ? '#222' : '#fff',
        default: dark ? '#111' : '#fafafa',
      },
    },
  });
};

class Theme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: theme(props.theme),
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.theme !== this.props.theme) {
      this.setState({ theme: theme(newProps.theme) });
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={this.state.theme}>
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}

Theme.defaultProps = {
  theme: 'light',
};

Theme.propTypes = {
  theme: PropTypes.string.isRequired,
};

function mapStateToProps(state, props) {
  return {
    theme: state.app.get('theme'),
  };
}

export default connect(
  mapStateToProps,
  null,
)(Theme);
