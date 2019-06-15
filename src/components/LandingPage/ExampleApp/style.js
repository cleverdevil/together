export default theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'hidden',
    // overflow: 'auto',
    borderRadius: theme.shape.borderRadius,
    border: `2px solid ${theme.palette.primary.main}`,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    maxWidth: 1200,
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  inner: {
    position: 'relative',
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    height: 550,
    maxHeight: '70vh',
  },
  drawer: {
    [theme.breakpoints.down('sm')]: {
      width: 240,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 2,
      maxWidth: '90%',
      '&.is-open': {},
      // flexShrink: 0,
    },
    [theme.breakpoints.up('md')]: {
      width: 240,
      // flexShrink: 0,
    },
  },
  drawerPaper: {
    position: 'static',
    [theme.breakpoints.up('md')]: {
      transform: 'none !important',
    },
  },
  timeline: {
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'auto',
  },
  exampleMap: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'stretch',
    justifyContent: 'stretch',

    '& > div': {
      width: '100%',
      height: '100%',
    },
  },
})
