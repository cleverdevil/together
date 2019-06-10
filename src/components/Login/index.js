import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from '@material-ui/core'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo-hooks'

const GET_TOKEN = gql`
  {
    token @client
  }
`

const GET_AUTH_URL = gql`
  mutation GetAuthUrl($url: String!) {
    getAuthUrl(url: $url)
  }
`

const Login = props => {
  const {
    data: { token },
  } = useQuery(GET_TOKEN)
  const [me, setMe] = useState('')
  const [loading, setLoading] = useState(false)
  // TODO: Auto login using saved jwt?

  const getAuthUrl = useMutation(GET_AUTH_URL, {
    variables: { url: me },
  })

  // Gets the auth url and redirects on submit
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await getAuthUrl()
      const { getAuthUrl: url } = data
      if (error || !url) {
        alert('Uh oh, there was an error getting your authorization url')
        console.log('[Error getting auth url]', error)
      }
      window.location.href = url
    } catch (err) {
      console.log('[Error getting auth url]', err)
    }
    setLoading(false)
    return false
  }

  if (token) {
    // return <Redirect to="/" />
  }

  return (
    <Dialog open={true} onClose={() => {}}>
      {loading ? <LinearProgress /> : null}
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Hey! Welcome to Together. Get started by logging in with your website.
        </DialogContentText>

        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            id="me"
            label="Your Website URL"
            type="url"
            name="me"
            style={{ margin: '1em 0' }}
            value={me}
            onChange={e => setMe(e.target.value)}
            disabled={loading}
            fullWidth
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={{ width: '100%', paddingTop: 15, paddingBottom: 15 }}
            disabled={loading}
          >
            Login
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

Login.defaultProps = {}

Login.propTypes = {}

export default Login
