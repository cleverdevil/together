import React from 'react';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import DeveloperModeIcon from 'material-ui-icons/DeveloperMode';
import LikeIcon from 'material-ui-icons/ThumbUp';
import ReplyIcon from 'material-ui-icons/Reply';
import RepostIcon from 'material-ui-icons/Repeat';


class Timeline extends React.Component {
  render() {
    return (
      <Grid container direction="column" spacing={24}>
        {this.props.items.map((item, i) => (
          <Grid item key={'card-' + i}>
            <Card>
              <CardHeader
                title={item.properties.author[0].properties.name[0]}
                subheader={item.properties.published[0]}
                avatar={
                  <Avatar
                    aria-label={item.properties.author[0].properties.name[0]}
                    alt={item.properties.author[0].properties.name[0]}
                    src={item.properties.author[0].properties.photo[0]}
                  />
                }  
              />
              {item.properties.photo && (
                item.properties.photo.map((photo, photoIndex) => (
                  <CardMedia
                    key={`card-${i}-photo-${photoIndex}`}
                    image={photo}
                    style={{height: 200}}
                  />
                ))
              )}
              <CardContent>
                <Typography type="headline" component="h2">
                  {item.properties.name}
                </Typography>
                {item.properties.summary && <Typography component="p">{item.properties.summary}</Typography>}
              </CardContent>  

              <CardActions>
                <IconButton>
                  <LikeIcon />
                </IconButton>
                <IconButton>
                  <RepostIcon />
                </IconButton>
                <IconButton>
                  <ReplyIcon />
                </IconButton>
                <IconButton onClick={() => console.log(item)} aria-label="Log">
                  <DeveloperModeIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>  
        ))}
      </Grid>
    );
  }
}
  
Timeline.defaultProps = {
  items: [],    
};

Timeline.propTypes = {
  items: PropTypes.array.isRequired,
};

export default Timeline;
  