import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Post from '../../Post'
import styles from './style'

const Preview = ({
  items,
  classes,
  selectedResult,
  handleFollow,
  handleBack,
}) => (
  <Card className={classes.results}>
    {selectedResult && (
      <ListItem>
        <Avatar alt="" src={selectedResult.photo}>
          {selectedResult.photo
            ? null
            : selectedResult.url
                .replace('https://', '')
                .replace('http://', '')
                .replace('www.', '')[0]}
        </Avatar>
        <ListItemText
          primary={selectedResult.name || selectedResult.url}
          secondary={selectedResult.url}
        />
      </ListItem>
    )}
    {items.map((item, i) => (
      <Post
        post={item}
        style={{ boxShadow: 'none' }}
        key={`search-preview-${i}`}
      />
    ))}
    <CardActions className={classes.fixedCardActions}>
      <Button size="small" color="secondary" onClick={handleFollow}>
        Follow
      </Button>
      <Button size="small" onClick={handleBack}>
        Back to Results
      </Button>
    </CardActions>
  </Card>
)

Preview.propTypes = {
  items: PropTypes.array.isRequired,
  selectedResult: PropTypes.object.isRequired,
  handleFollow: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
}

export default withStyles(styles)(Preview)
