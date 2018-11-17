import React from 'react';
import BaseAction from './base-action';
import LogIcon from '@material-ui/icons/DeveloperMode';

const ActionConsoleLog = ({ post, menuItem }) => (
  <BaseAction
    onClick={e => console.log(post)}
    title="Log to console"
    icon={<LogIcon />}
    menuItem={menuItem}
  />
);

export default ActionConsoleLog;
