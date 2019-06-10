import { useQuery } from 'react-apollo-hooks'
import { MICROPUB_QUERY } from '../queries'

export default function(query) {
  const { data: rawData, ...res } = useQuery(MICROPUB_QUERY, {
    variables: { query },
  })

  let data = {}

  if (rawData && rawData.micropubQuery) {
    data = JSON.parse(rawData.micropubQuery)
  }

  return { data, ...res }
}
