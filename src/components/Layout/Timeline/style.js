export default theme => ({
  timeline: {
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    overflow: 'auto',
    overscrollBehaviorY: 'contain',
    '& > div': {
      maxWidth: 600,
    },
  },
  loadMore: {
    display: 'block',
    width: '100%',
    marginTop: 40,
  },
})
