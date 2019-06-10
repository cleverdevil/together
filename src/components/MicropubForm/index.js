import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import useReactRouter from 'use-react-router'
import { withStyles } from '@material-ui/core/styles'
import MicropubEditor from 'micropub-client-editor'
import { Input, InputLabel, Button, Checkbox, Select } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import useUser from '../../hooks/use-user'
import styles from './style'

let micropub = null

const MicropubForm = ({
  properties,
  onSubmit,
  expanded,
  classes,
  shownProperties,
  onClose,
}) => {
  const { user } = useUser()
  const { history } = useReactRouter()

  const formShownProperties = [...shownProperties]
  let formProperties = properties
  if (expanded) {
    formShownProperties.push('mp-slug', 'visibility', 'post-status')
  }

  if (user && user.settings.noteSyndication.length) {
    if (!formProperties) {
      formProperties = {}
    }
    formProperties['mp-syndicate-to'] = user.settings.noteSyndication
    if (expanded) {
      formShownProperties.push('mp-syndicate-to')
    }
  }

  return (
    <form
      className={
        expanded
          ? [classes.expandedContainer, classes.container].join(' ')
          : classes.container
      }
      onSubmit={e => {
        e.preventDefault()
        onSubmit(micropub)
      }}
    >
      <MicropubEditor
        richContent={expanded}
        properties={formProperties}
        shownProperties={formShownProperties}
        buttonComponent={Button}
        inputComponent={props => <Input fullWidth={true} {...props} />}
        textareaComponent={props => (
          <Input
            {...props}
            rows={3}
            fullWidth={true}
            multiline={true}
            rowsMax={!expanded ? 6 : null}
            autoFocus={!expanded && props.id === 'mf2_content'}
          />
        )}
        labelComponent={props => (
          <InputLabel
            {...props}
            style={{ marginBottom: 10, display: 'block' }}
          />
        )}
        checkboxComponent={props => (
          <Fragment>
            <Checkbox {...props} />
            <span style={{ width: 10, display: 'inline-block' }} />
          </Fragment>
        )}
        selectComponent={props => <Select fullWidth={true} {...props} />}
        // syndication={syndicationProviders}
        onChange={mf2 => {
          micropub = mf2
        }}
      />
      {!expanded && (
        <Button
          onClick={e => {
            let editorState = null
            if (micropub) {
              editorState = { properties: micropub.properties }
            }
            history.push('/editor', editorState)
            if (onClose) {
              onClose()
            }
          }}
        >
          Full Editor
        </Button>
      )}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        className={classes.submitButton}
      >
        Send <SendIcon className={classes.submitButtonIcon} />
      </Button>
    </form>
  )
}

MicropubForm.defaultProps = {
  expanded: false,
  shownProperties: ['content'],
}

MicropubForm.propTypes = {
  expanded: PropTypes.bool.isRequired,
  shownProperties: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  properties: PropTypes.object,
}

export default withStyles(styles)(MicropubForm)
