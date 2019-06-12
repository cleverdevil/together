import { useQuery } from 'react-apollo-hooks'
import { GET_CHANNELS } from '../queries'

const useChannels = () => {
  const res = useQuery(GET_CHANNELS)
  const channels = res.data.channels ? res.data.channels : []
  return { channels, ...res }
}

export default useChannels
