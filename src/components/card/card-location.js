import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import SingleAvatarMap from '../single-avatar-map';
import CardContent from '@material-ui/core/CardContent';

const style = theme => ({});

const TogetherCardLocation = ({ location, author, classes }) => {
  let map = null;
  let lat = false;
  let lng = false;
  if (!location) {
    return null;
  }
  if (location.latitude && location.longitude) {
    lat = parseFloat(location.latitude);
    lng = parseFloat(location.longitude);
  }

  if (lat !== false && lng !== false) {
    map = <SingleAvatarMap lat={lat} lng={lng} author={author} />;
  }

  return (
    <React.Fragment>
      {location.name && <CardContent>{location.name}</CardContent>}
      {map}
    </React.Fragment>
  );
};

export default withStyles(style)(TogetherCardLocation);
