import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { FormControl } from '@material-ui/core'
import SettingsModal from '../SettingsModal'
import SyndicationSettings from './SyndicationSettings'
import styles from './style'

const Settings = ({ classes }) => {
  return (
    <SettingsModal title="Settings">
      <div>
        <FormControl component="fieldset" className={classes.fieldset}>
          <SyndicationSettings />
        </FormControl>
      </div>
    </SettingsModal>
  )
}

export default withStyles(styles)(Settings)
