import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import useReactRouter from 'use-react-router'
import { Card, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Search from './Search'
import Results from './Results'
import styles from './style'

const AddFeed = ({ classes }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState(null)
  const {
    match: {
      params: { channelSlug },
    },
  } = useReactRouter()
  const currentChannel = channelSlug ? decodeURIComponent(channelSlug) : null

  const handleCancel = e => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    setSearchOpen(false)
    setSearch(false)
    return false
  }

  const handleSearch = async query => {
    setSearch(query)
    setSearchOpen(false)
    return false
  }

  if (!currentChannel) {
    return null
  }

  return (
    <div className={classes.container}>
      {!!searchOpen && (
        <Card className={classes.card}>
          <Search handleSearch={handleSearch} handleCancel={handleCancel} />
        </Card>
      )}

      {!!search && (
        <Card className={classes.card}>
          <Results query={search} handleCancel={handleCancel} />
        </Card>
      )}

      <Button
        variant="fab"
        color="secondary"
        aria-label="Add New Subscription"
        className={classes.fabButton}
        onClick={() => setSearchOpen(true)}
      >
        <AddIcon />
      </Button>
    </div>
  )
}

AddFeed.defaultProps = {
  currentChannel: false,
}

export default withStyles(styles)(AddFeed)
