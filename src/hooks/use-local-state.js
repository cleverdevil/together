import { useCallback, useState, useEffect } from 'react'
import { useQuery, useApolloClient } from 'react-apollo-hooks'
import gql from 'graphql-tag'

const GET_ALL = gql`
  {
    theme @client
    token @client
    channelsMenuOpen @client
    focusedComponent @client
    shortcutHelpOpen @client
  }
`

export default function() {
  const client = useApolloClient()
  const { data: localState } = useQuery(GET_ALL)

  const [state, setState] = useState(localState || {})

  const set = useCallback(data => {
    client.writeData({ data })
    if (data.theme) {
      localStorage.setItem('together-theme', data.theme)
    }
    setState(Object.assign({}, state.current, data))
  }, [])

  useEffect(() => {
    setState(localState)
  }, [localState])

  return [state, set]
}
