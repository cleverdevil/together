import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
    }
  }

  render() {
    const { handleCancel, handleSearch } = this.props
    const { search } = this.state
    return (
      <Card
        style={{
          marginBottom: 10,
          width: 320,
          maxWidth: '100%',
        }}
      >
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSearch(search)
          }}
        >
          <CardContent>
            <TextField
              required
              fullWidth
              autoFocus={true}
              type="search"
              label="Who / What do you want to add?"
              value={search}
              onChange={e => this.setState({ search: e.target.value })}
            />
          </CardContent>
          <CardActions>
            <Button size="small" color="secondary" type="submit">
              Search
            </Button>
            <Button
              size="small"
              onClick={() => {
                this.setState({ search: '' })
                handleCancel()
              }}
            >
              Cancel
            </Button>
          </CardActions>
        </form>
      </Card>
    )
  }
}

Search.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
}

export default Search
