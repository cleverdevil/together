import React, { Fragment } from 'react'
import useMicropubQuery from '../../hooks/use-micropub-query'
import { withStyles } from '@material-ui/core/styles'
import {
  List,
  ListItem,
  ListSubheader,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Switch,
  LinearProgress,
} from '@material-ui/core'
import useUser from '../../hooks/use-user'
import styles from './style'

const SyndicationSettings = ({ classes }) => {
  const { data, error, refetch, networkStatus } = useMicropubQuery(
    'syndicate-to',
    { notifyOnNetworkStatusChange: true }
  )
  const { user, setOption } = useUser()

  const syndicationProviders =
    data && data['syndicate-to'] ? data['syndicate-to'] : false

  const toggleProvider = (name, provider) => {
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

  if (networkStatus < 7 || !user) {
    return (
      <ListItem>
        <LinearProgress style={{ width: '100%' }} />
      </ListItem>
    )
  }

  const SyndicationSet = ({ title, settingKey }) => (
    <>
      <ListSubheader>{title}</ListSubheader>
      {syndicationProviders.map(provider => {
        const handleChange = () => toggleProvider(settingKey, provider.uid)
        return (
          <ListItem
            button
            key={`${settingKey}-setting-${provider.uid}`}
            onClick={handleChange}
          >
            <ListItemText>{provider.name}</ListItemText>
            <ListItemSecondaryAction>
              <Switch
                checked={
                  user && user.settings[settingKey].includes(provider.uid)
                }
                value={provider.uid}
                onChange={handleChange}
                name={settingKey}
              />
            </ListItemSecondaryAction>
          </ListItem>
        )
      })}
    </>
  )

  if (syndicationProviders) {
    return (
      <List>
        <SyndicationSet title="Like Syndication" settingKey="likeSyndication" />
        <SyndicationSet
          title="Repost Syndication"
          settingKey="repostSyndication"
        />
        <SyndicationSet title="Note Syndication" settingKey="noteSyndication" />

        <ListSubheader>Update Providers</ListSubheader>
        <ListItem>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => refetch()}
          >
            Update Syndication Providers
          </Button>
        </ListItem>
      </List>
    )
  }

  return null
}

export default withStyles(styles)(SyndicationSettings)
