import { useQuery } from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'
import { GET_CHANNELS } from '../queries'

const useChannels = () => {
  const res = useQuery(GET_CHANNELS)
  const {
    location: { pathname },
  } = useReactRouter()
  const channels = res.data.channels ? res.data.channels : []
  let channel = {}
  let channelSlug = null
  if (pathname.startsWith('/channel/')) {
    const parts = pathname.split('/')
    channelSlug = parts[2]
  }
  if (channels.length && channelSlug) {
    channel = channels.find(c => c._t_slug === channelSlug) || {}
  }
  return channel
}

export default useChannels
