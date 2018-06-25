import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ViewIcon from '@material-ui/icons/Link';

const ActionView = ({ url }) => (
  <Tooltip title="View Original" placement="top">
    <a href={url}>
      <IconButton>
        <ViewIcon />
      </IconButton>
    </a>
  </Tooltip>
);

export default ActionView;
