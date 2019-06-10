import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { withStyles } from '@material-ui/core/styles'
import {
  Avatar,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
} from '@material-ui/core'
import Preview from '../Preview'
import { SEARCH } from '../../../queries'
import styles from '../style'

const Results = ({ handleCancel, classes, query }) => {
  const [preview, setPreview] = useState(null)
  const {
    loading,
    data: { search: results },
    error,
  } = useQuery(SEARCH, { variables: { query } })

  const defaultActions = [
    <Button size="small" onClick={handleCancel}>
      Cancel
    </Button>,
  ]
  const [actions, setActions] = useState(defaultActions)

  if (actions === null) {
    setActions(defaultActions)
  }

  if (loading) {
    return (
      <ListItem>
        <ListItemText primary="Searching..." />
        <CircularProgress />
      </ListItem>
    )
  }

  if (error || results.length === 0) {
    return (
      <ListItem>
        <ListItemText primary="No results" secondary="Please try again" />
      </ListItem>
    )
  }

  return (
    <>
      <List>
        {results.map((result, i) => (
          <>
            <ListItem
              button
              onClick={() => setPreview(result.url)}
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
            {preview === result.url && (
              <Preview
                url={result.url}
                setActions={setActions}
                handleClose={e => {
                  setPreview(null)
                }}
              />
            )}
          </>
        ))}
      </List>
      <CardActions className={classes.actions}>{actions}</CardActions>
    </>
  )
}

export default withStyles(styles)(Results)
