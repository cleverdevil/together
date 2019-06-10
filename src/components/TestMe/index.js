import React from 'react'
import useReactRouter from 'use-react-router'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { FRAGMENT_POST_PROPERTIES } from '../../queries'
import { LinearProgress, AppBar, Tabs, Tab } from '@material-ui/core'
import Timeline from '../Layout/Timeline'

const GET_POSTS = gql`
  query GetMicropubPosts($postType: String) {
    micropubPosts(postType: $postType) {
      ...PostProperties
    }
  }
  ${FRAGMENT_POST_PROPERTIES}
`

const TabLink = ({ label, postType }) => {
  const { match } = useReactRouter()
  const currentPostType = match.params.postType

  return (
    <Tab
      label={label}
      to={'/me/' + postType}
      component={Link}
      selected={currentPostType === postType}
    />
  )
}

const MicropubPosts = props => {
  const { match } = useReactRouter()
  const postType = match.params.postType
  const { loading, data, fetchMore } = useQuery(
    GET_POSTS,
    postType ? { variables: { postType } } : {}
  )

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {loading && <LinearProgress style={{ width: '100%' }} />}

      <AppBar
        position="static"
        color="default"
        style={{ zIndex: 1, position: 'relative' }}
      >
        <Tabs indicatorColor="primary" textColor="primary" variant="fullWidth">
          <TabLink label="Notes" postType="note" />
          <TabLink label="Articles" postType="article" />
          <TabLink label="Replies" postType="reply" />
          <TabLink label="Photos" postType="photo" />
          <TabLink label="Likes" postType="like" />
        </Tabs>
      </AppBar>
      {data.micropubPosts && (
        <Timeline posts={data.micropubPosts} loadMore={fetchMore} />
      )}
    </div>
  )
}

export default MicropubPosts
