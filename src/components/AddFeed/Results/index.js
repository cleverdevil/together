import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import styles from '../../Post/Photos/style'

const Results = ({ results, handleResultSelect, handleCancel, classes }) => {
  if (results.length === 0) {
    return (
      <Card className={classes.results}>
        <ListItem>
          <ListItemText primary="No results" secondary="Please try again" />
        </ListItem>
      </Card>
    )
  } else {
    return (
      <Card className={classes.results}>
        <List>
          {results.map((result, i) => (
            <ListItem
              button
              onClick={() => handleResultSelect(result)}
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
          ))}
        </List>
        <CardActions className={classes.fixedCardActions}>
          <Button size="small" onClick={handleCancel}>
            Cancel
          </Button>
        </CardActions>
      </Card>
    )
  }
}

export default withStyles(styles)(Results)
