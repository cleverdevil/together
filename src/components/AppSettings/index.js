import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import SettingsModal from '../SettingsModal'
import SyndicationSettings from './SyndicationSettings'
import styles from './style'

const Settings = ({ classes }) => {
  return (
    <SettingsModal title="Settings">
      <SyndicationSettings />
    </SettingsModal>
  )
}

export default withStyles(styles)(Settings)
