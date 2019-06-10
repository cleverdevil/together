import React, { Fragment } from 'react'
import useMicropubQuery from '../../hooks/use-micropub-query'
import { withStyles } from '@material-ui/core/styles'
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  FormLabel,
  Switch,
  Button,
  CircularProgress,
} from '@material-ui/core'
import useUser from '../../hooks/use-user'
import styles from './style'

const SyndicationSettings = ({ classes }) => {
  const { data, loading, error, refetch } = useMicropubQuery('syndicate-to')
  const { user, setOption } = useUser()

  const syndicationProviders =
    data && data['syndicate-to'] ? data['syndicate-to'] : false

  const handleChange = e => {
    const { value: provider, name } = e.target
    const syndication = user.settings[name]
    const index = syndication.findIndex(s => s === provider)
    if (index > -1) {
      syndication.splice(index, 1)
    } else {
      syndication.push(provider)
    }
    setOption(name, syndication)
  }

  if (error) {
    return null
  }

  if (loading || !user) {
    return <CircularProgress />
  }

  const SyndicationSet = ({ title, settingKey }) => (
    <FormControl component="div">
      <FormLabel component="span">{title}</FormLabel>
      <FormGroup>
        {syndicationProviders.map(provider => (
          <FormControlLabel
            key={`${settingKey}-setting-${provider.uid}`}
            control={
              <Switch
                checked={
                  user && user.settings[settingKey].includes(provider.uid)
                }
                value={provider.uid}
                onChange={handleChange}
                name={settingKey}
              />
            }
            label={provider.name}
          />
        ))}
      </FormGroup>
    </FormControl>
  )

  if (syndicationProviders) {
    return (
      <Fragment>
        <SyndicationSet title="Like Syndication" settingKey="likeSyndication" />
        <SyndicationSet
          title="Repost Syndication"
          settingKey="repostSyndication"
        />
        <SyndicationSet title="Note Syndication" settingKey="noteSyndication" />

        <Button onClick={refetch} variant="contained">
          Update Syndication Providers
        </Button>
      </Fragment>
    )
  }

  return null
}

export default withStyles(styles)(SyndicationSettings)
