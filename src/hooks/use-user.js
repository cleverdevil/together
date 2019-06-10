import { useQuery, useMutation } from 'react-apollo-hooks'
import { useSnackbar } from 'notistack'
import { GET_USER, SET_USER_OPTION } from '../queries'

export default function() {
  const { enqueueSnackbar } = useSnackbar()
  const {
    data: { user },
    ...res
  } = useQuery(GET_USER)
  const setUserOption = useMutation(SET_USER_OPTION)

  const setOption = async (key, value) => {
    const val = typeof value === 'object' ? JSON.stringify(value) : value
    const res = await setUserOption({
      variables: { key, value: val },
      optimisticResponse: {
        __typename: 'Mutation',
        setUserOption: true,
      },
      update: (proxy, _) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: GET_USER,
        })
        // Reorder the channels
        data.user.settings[key] = value
        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_USER, data })
      },
    })

    if (res.error) {
      console.error('[Error setting user option]', res.error)
      enqueueSnackbar('Error setting option', { variant: 'error' })
    }

    return res
  }

  return { user, setOption, ...res }
}
