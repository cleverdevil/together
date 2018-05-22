import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = type => {
  const dark = type == 'dark' ? true : false;
  return createMuiTheme({
    typography: {
      fontFamily:
        '"Inter UI", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif',
      fontWeightLight: 400,
      fontWeightRegular: 400,
      fontWeightMedium: 900,
    },
    palette: {
      type: type,
      primary: {
        light: dark ? '#484848' : '#819ca9',
        main: dark ? '#212121' : '#546e7a',
        dark: dark ? '#000000' : '#29434e',
        contrastText: '#fff',
      },
      secondary: {
        light: '#5e92f3',
        main: '#1565c0',
        dark: '#003c8f',
        contrastText: '#fff',
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
    if (newProps.theme != this.props.theme) {
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

export default connect(mapStateToProps, null)(Theme);
