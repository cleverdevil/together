import { useQuery } from 'react-apollo-hooks'
import { MICROPUB_QUERY } from '../queries'

export default function(query, options = {}) {
  const { data: rawData, ...res } = useQuery(MICROPUB_QUERY, {
    variables: { query },
    ...options,
  })

  let data = {}

  if (rawData && rawData.micropubQuery) {
    data = JSON.parse(rawData.micropubQuery)
  }

  return { data, ...res }
}
