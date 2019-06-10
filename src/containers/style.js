const scrollbarWidth = 6

export default theme => ({
  appWrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    overflow: 'hidden',

    '& *::-webkit-scrollbar': {
      width: scrollbarWidth,
    },

    '& *::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.text.hint,
      borderRadius: scrollbarWidth / 2,
    },
  },
  root: {
    background: theme.palette.background.default,
    flexGrow: 1,
    flexShrink: 1,
    flexWrap: 'nowrap',
    position: 'relative',
    transition: 'transform .3s',
    overflow: 'hidden',
    width: '100%',
  },
  channelMenu: {
    width: 200,
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      width: 200,
      position: 'absolute',
      right: '100%',
      height: '100%',
      transition: 'transform .3s',
    },
  },
  channelMenuOpen: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translateX(200px)',
      overflow: 'visible',
    },
  },
  main: {
    background: theme.palette.background.default,
    overflow: 'hidden',
    flexGrow: 1,
    flexShrink: 1,
  },
})
