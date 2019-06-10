import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
} from '@material-ui/core'
import styles from '../style'

const Search = ({ handleCancel, handleSearch, classes }) => {
  const [search, setSearch] = useState('')

  return (
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
          onChange={e => setSearch(e.target.value)}
        />
      </CardContent>
      <CardActions>
        <Button size="small" color="secondary" type="submit">
          Search
        </Button>
        <Button
          size="small"
          onClick={() => {
            setSearch('')
            handleCancel()
          }}
        >
          Cancel
        </Button>
      </CardActions>
    </form>
  )
}

Search.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
}

export default withStyles(styles)(Search)
