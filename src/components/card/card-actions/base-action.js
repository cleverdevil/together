import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const TogetherCardBaseAction = ({ title, icon, onClick, menuItem = false }) => {
  if (menuItem) {
    return <MenuItem onClick={onClick}>{title}</MenuItem>;
  } else {
    return (
      <Tooltip title={title} placement="top">
        <IconButton onClick={onClick}>{icon}</IconButton>
      </Tooltip>
    );
  }
};

export default TogetherCardBaseAction;
