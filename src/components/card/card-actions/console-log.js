import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import LogIcon from '@material-ui/icons/DeveloperMode';

const ActionConsoleLog = ({ post }) => (
  <Tooltip title="Log to console" placement="top">
    <IconButton onClick={e => console.log(post)}>
      <LogIcon />
    </IconButton>
  </Tooltip>
);

export default ActionConsoleLog;
