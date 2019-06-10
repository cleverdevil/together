import { useMutation } from 'react-apollo-hooks'
import { MICROPUB_CREATE } from '../queries'

export default function() {
  const create = useMutation(MICROPUB_CREATE)

  return async mf2 => {
    const {
      data: { micropubCreate: postUrl },
    } = await create({
      variables: {
        json: JSON.stringify(mf2),
      },
    })
    return postUrl
  }
}
