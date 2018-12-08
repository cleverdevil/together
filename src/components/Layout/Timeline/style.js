export default theme => ({
  timeline: {
    display: 'block',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    overflow: 'auto',
    overscrollBehaviorY: 'contain',
    outline: 'none',
    '& > div': {
      maxWidth: 600,
    },
  },
  shortcuts: {
    outline: 'none',
  },
  loadMore: {
    display: 'block',
    width: '100%',
    marginTop: 40,
  },
})
