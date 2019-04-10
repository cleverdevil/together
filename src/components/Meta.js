import React from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

const Meta = ({ title = '', theme }) => (
  <Helmet>
    <meta
      name="theme-color"
      content={theme === 'dark' ? '#111111' : '#1565c0'}
    />
    <title>{title ? `${title} - Together` : 'Together'}</title>
  </Helmet>
)

const mapStateToProps = state => ({
  theme: state.app.get('theme'),
})

export default connect(mapStateToProps)(Meta)
