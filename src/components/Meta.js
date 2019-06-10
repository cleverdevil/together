import React from 'react'
import { Helmet } from 'react-helmet'
import useLocalState from '../hooks/use-local-state'

const Meta = ({ title = '' }) => {
  const [localState] = useLocalState()

  return (
    <Helmet
      title={title}
      meta={[
        {
          name: 'theme-color',
          content: localState.theme === 'dark' ? '#111111' : '#1565c0',
        },
      ]}
    />
  )
}

export default Meta
