import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { IconButton, Tooltip } from '@material-ui/core'
import { useMutation, useQuery } from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'
import gql from 'graphql-tag'
import layouts from '../../modules/layouts'
import styles from './style'
import { GET_CHANNELS } from '../../queries'

export const UPDATE_LAYOUT = gql`
  mutation updateLayout($uid: String!, $_t_layout: String!) {
    updateChannel(uid: $uid, _t_layout: $_t_layout) {
      uid
      _t_layout
    }
  }
`

const LayoutSwitcher = ({ classes, className }) => {
  let channel = null
  const { data } = useQuery(GET_CHANNELS)
  const { match } = useReactRouter()
  if (match.params && match.params.channelSlug && data && data.channels) {
    channel = data.channels.find(
      channel => channel._t_slug === match.params.channelSlug
    )
  }

  if (!channel) {
    return null
  }

  const updateChannel = useMutation(UPDATE_LAYOUT)

  return (
    <div className={[classes.menu, className].join(' ')}>
      {layouts.map(layout => {
        const Icon = layout.icon
        let iconClassName = classes.icon
        // Add class if layout selected
        if (layout.id === channel._t_layout) {
          iconClassName += ' ' + classes.iconSelected
        }

        return (
          <Tooltip
            title={layout.name}
            key={'layout-switcher-' + layout.id}
            placement="right"
          >
            <IconButton
              className={iconClassName}
              onClick={() =>
                updateChannel({
                  variables: { uid: channel.uid, _t_layout: layout.id },
                })
              }
            >
              <Icon />
            </IconButton>
          </Tooltip>
        )
      })}
    </div>
  )
}

export default withStyles(styles)(LayoutSwitcher)
