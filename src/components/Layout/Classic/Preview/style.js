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
  text: {
    paddingRight: 0,
  },
})
