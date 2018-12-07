export default theme => ({
  item: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
  },
  read: {
    opacity: 0.5,
  },
  highlighted: {
    opacity: 1,
    color: theme.palette.primary.contrastText,
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.secondary.main
        : theme.palette.primary.main,
  },
  text: {
    paddingRight: 0,
    color: 'inherit',
  },
})
