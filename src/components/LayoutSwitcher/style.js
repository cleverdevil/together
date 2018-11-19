export default theme => ({
  menu: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    background: theme.palette.primary.main,
  },
  icon: {
    color: 'rgba(255,255,255,.3)',
    '&:hover': {
      color: theme.palette.primary.contrastText,
    },
  },
  iconSelected: {
    color: theme.palette.primary.contrastText,
  },
})
