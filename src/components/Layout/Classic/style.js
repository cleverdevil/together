export default theme => ({
  wrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1,
  },
  previewColumn: {
    width: '100%',
    overflow: 'auto',
    overscrollBehaviorY: 'contain',
    borderRight: '1px solid ' + theme.palette.divider,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      width: 250,
    },
    [theme.breakpoints.up('md')]: {
      width: 300,
    },
    [theme.breakpoints.up('lg')]: {
      width: 400,
    },
  },
  postColumn: {
    flexGrow: 1,
    // overflow: 'auto',
    position: 'absolute',
    width: '100%',
    height: '100%',
    // iOS hack thing
    overflowY: 'scroll',
    overscrollBehaviorY: 'contain',
    '-webkit-overflow-scrolling': 'touch',
    [theme.breakpoints.up('sm')]: {
      position: 'relative',
    },
  },
  loadMore: {
    width: '100%',
  },
  closePost: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
})
