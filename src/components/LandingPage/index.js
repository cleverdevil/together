import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Typography, Button, Link } from '@material-ui/core'
import SocialIcon from '@material-ui/icons/Group'
import DecentralizedIcon from '@material-ui/icons/DeviceHub'
import useLocalState from '../../hooks/use-local-state'
import Meta from '../Meta'
import Login from '../Login'
import ExampleApp from './ExampleApp'
import style from './style'

const LandingPage = ({ classes }) => {
  const [loginOpen, setLoginOpen] = useState(false)
  const [localState] = useLocalState()

  return (
    <>
      <Meta title="Together - A social reader" />
      <div className={classes.header}>
        <div className={classes.container}>
          <Typography variant="h2" className={classes.title}>
            Together
          </Typography>
          <Typography variant="h5" component="p" className={classes.tagline}>
            An #indieweb social reader by{' '}
            <Link href="https://grant.codes">grant.codes</Link>
          </Typography>
        </div>
      </div>
      {localState && localState.token ? (
        <RouterLink to="/">
          <Button
            size="large"
            variant="contained"
            color="primary"
            className={classes.login}
          >
            Back to App
          </Button>
        </RouterLink>
      ) : (
        <Button
          onClick={e => setLoginOpen(true)}
          size="large"
          variant="contained"
          color="primary"
          className={classes.login}
        >
          Login
        </Button>
      )}
      <div className={classes.container}>
        <Grid container justify="center" alignItems="flex-start">
          <Grid item className={classes.feature}>
            <SocialIcon className={classes.featureIcon} />
            <Typography classeName={classes.featureText} variant="h5" paragraph>
              Together is a social reader based on{' '}
              <Link href="https://indieweb.org">IndieWeb</Link> technologies.
            </Typography>
          </Grid>

          <Grid item className={classes.feature}>
            <DecentralizedIcon className={classes.featureIcon} />
            <Typography className={classes.featureText} variant="h5" paragraph>
              You can read, and interact with decentralized content all from one
              flexible space
            </Typography>
          </Grid>
        </Grid>

        <Typography
          variant="h4"
          paragraph
          style={{ textAlign: 'center', marginTop: 100 }}
        >
          Take it for a spin
        </Typography>
      </div>

      <ExampleApp />

      <div className={classes.container}>
        <Typography variant="h4" paragraph>
          What You Need
        </Typography>

        <Typography variant="h5" paragraph>
          #1 Your own website
        </Typography>
        <Typography paragraph>
          On the IndieWeb your website is your identity. It doesn't need to be
          advanced, it doesn't need to be pretty, it just needs to be{' '}
          <strong>yours</strong>.
        </Typography>

        <Typography variant="h5" paragraph>
          #2 IndieAuth
        </Typography>
        <Typography paragraph>
          <Link href="https://indieweb.org/indieauth">IndieAuth</Link> is a
          technology to allow you to sign into services using only your website.
        </Typography>

        <Typography variant="h5" paragraph>
          #3 A MicroSub Server
        </Typography>
        <Typography paragraph>
          <Link href="https://indieweb.org/microsub">MicroSub</Link> is where
          the real magic happens. There are 2 parts; the server and the client.
          Together is the client, but it needs a server to go along with it. The
          server does a lot of tricky work such as fetching & parsing feeds as
          well as keeping track of what you have read and how you have
          everything organized. If you don't already have a MicroSub server then
          check out <Link href="https://aperture.p3k.io">Aperture</Link>.
        </Typography>

        <Typography variant="h5" paragraph>
          #4 MicroPub (optional)
        </Typography>
        <Typography paragraph>
          <Link href="https://indieweb.org/micropub">MicroPub</Link> is an
          optional but very cool piece of the puzzle. If your own website has
          MicroPub functionality then you can use Together not just to read
          content, but also to reply and create your own content. You can like,
          repost and reply to stuff you are following, you can even write full
          on blog posts from inside Together.
        </Typography>
      </div>

      {loginOpen && <Login onClose={e => setLoginOpen(false)} />}
    </>
  )
}

export default withStyles(style)(LandingPage)
