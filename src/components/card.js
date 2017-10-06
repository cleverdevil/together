import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card';
import { GridList, GridListTile } from 'material-ui/GridList';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import DeveloperModeIcon from 'material-ui-icons/DeveloperMode';
import LikeIcon from 'material-ui-icons/ThumbUp';
import ReplyIcon from 'material-ui-icons/Reply';
import RepostIcon from 'material-ui-icons/Repeat';
import moment from 'moment';


class TogetherCard extends React.Component {
  constructor(props) {
    super(props);
    this.renderPhotos = this.renderPhotos.bind(this);
  }

  renderPhotos(photos) {
    if (!photos) {
      return null;
    }
    if (photos.length === 1) {
      return (
        <img
          src={photos[0]}
          style={{display: 'block', width: '100%', height: 'auto'}}
        />
      );
    } else if (photos.length > 1) {
      return (
        <GridList cellHeight={160} cols={3}>
          {photos.map(photo => (
            <GridListTile key={photo} cols={1}>
              <img src={photo} alt="" />
            </GridListTile>
          ))}
        </GridList>
      );
    }
    return null;
  }

  render() {
    const item = this.props.post;
    return (
      <Card>
        <CardHeader
          title={item.properties.author[0].properties.name[0]}
          subheader={moment(item.properties.published[0]).fromNow()}
          avatar={
            <Avatar
              aria-label={item.properties.author[0].properties.name[0]}
              alt={item.properties.author[0].properties.name[0]}
              src={item.properties.author[0].properties.photo[0]}
            />
          }  
        />
        {this.renderPhotos(item.properties.photo)}
        <CardContent>
          <Typography type="headline" component="h2">
            {item.properties.name}
          </Typography>
          {item.properties.summary && <Typography component="p">{item.properties.summary}</Typography>}
        </CardContent>  

        <CardActions>
          <Tooltip title="Like" placement="top">
            <IconButton>
              <LikeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Repost" placement="top">
            <IconButton>
              <RepostIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reply" placement="top">  
            <IconButton>
              <ReplyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Log to console" placement="top">
            <IconButton onClick={() => console.log(item)} aria-label="Log">
              <DeveloperModeIcon />
            </IconButton>
          </Tooltip>  
        </CardActions>
      </Card>
    );
  }
}
  
TogetherCard.defaultProps = {
  post: [],
};

TogetherCard.propTypes = {
  post: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

export default connect(null, mapDispatchToProps)(TogetherCard);
  