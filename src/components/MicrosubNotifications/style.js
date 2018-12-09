export default theme => ({
  icon: { position: 'relative', display: 'inline-block' },
  loadingIcon: {
    opacity: 0.7,
  },
  iconSpinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    color: theme.palette.grey[100],
    opacity: 0.4,
  },
  popover: {
    paper: {
      width: '100%',
      maxHeight: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 400,
        minWidth: 400,
        maxWidth: '90%',
      },
    },
    [theme.breakpoints.up('sm')]: {
      maxHeight: '80%',
    },
  },
  container: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 400,
    },
  },
  loadMore: {},
  spinner: {
    position: 'fixed',
    top: 'calc(50% - 25px)',
    left: 'calc(50% - 25px)',
  },
})
