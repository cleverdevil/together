import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import styles from './style'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
    console.log('React caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      const { classes } = this.props
      return (
        <Card className={classes.card}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Uh Oh{' '}
              <span role="img" aria-label="">
                🙈
              </span>
            </Typography>
            <Typography component="p">
              Something here went very wrong. If you look in the console you
              should see the error details
            </Typography>
          </CardContent>
          <CardActions>
            <a
              href="https://github.com/cleverdevil/together/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="small" color="primary" variant="contained">
                Check the GitHub issues
              </Button>
            </a>
            <Button
              size="small"
              onClick={() => this.setState({ hasError: false })}
            >
              Close
            </Button>
          </CardActions>
        </Card>
      )
    }
    return this.props.children
  }
}

export default withStyles(styles)(ErrorBoundary)
