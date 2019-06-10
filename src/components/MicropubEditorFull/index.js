import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import useMicropubCreate from '../../hooks/use-micropub-create'
import MicropubForm from '../MicropubForm'
import SnackbarLinkAction from '../SnackbarLinkAction'
import styles from './style'
import { useSnackbar } from 'notistack'

const FullMicropubEditor = ({ classes, location: { state } }) => {
  const create = useMicropubCreate()
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = async mf2 => {
    try {
      const postUrl = await create(mf2)
      enqueueSnackbar('Successfully posted', {
        type: 'success',
        action: [<SnackbarLinkAction url={postUrl} />],
      })
    } catch (err) {
      console.error('Error creating post', err)
      enqueueSnackbar('Error creating post', { type: 'error' })
    }
  }

  const properties = state && state.properties ? state.properties : {}
  const shownProperties = ['name', 'content', ...Object.keys(properties)]
  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <MicropubForm
          expanded={true}
          properties={properties || {}}
          shownProperties={shownProperties}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default withStyles(styles)(FullMicropubEditor)
