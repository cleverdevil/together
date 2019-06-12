import { useQuery } from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'
import { GET_CHANNELS } from '../queries'

const useChannels = () => {
  const res = useQuery(GET_CHANNELS)
  const {
    match: {
      params: { channelSlug },
    },
  } = useReactRouter()
  const channels = res.data.channels ? res.data.channels : []
  let channel = {}
  if (channels.length && channelSlug) {
    channel = channels.find(c => c._t_slug === channelSlug) || {}
  }
  return channel
}

export default useChannels
