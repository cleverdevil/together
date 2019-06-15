export default theme => {
  return {
    container: {
      width: '100%',
      maxWidth: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: theme.spacing.unit * 2,
    },
    header: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'stretch',
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      overflow: 'hidden',
      textAlign: 'center',
      minHeight: '50vh',
      background: theme.palette.primary.main,
      color: theme.palette.getContrastText(theme.palette.primary.main),
      boxShadow: theme.shadows[3],

      '& a': {
        color: 'inherit',
      },
    },
    title: {
      lineHeight: 1.2,
      marginBottom: theme.spacing.unit * 2,
      color: 'inherit',
    },
    tagline: {
      color: 'inherit',
    },
    login: {
      position: 'fixed',
      top: theme.spacing.unit * 2,
      right: theme.spacing.unit * 4,
      background: theme.palette.primary.light,
    },
    feature: {
      textAlign: 'center',
      fontSize: 20,
      padding: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 5,
      marginBottom: theme.spacing.unit * 5,
      [theme.breakpoints.up('sm')]: {
        width: '50%',
      },
    },
    featureIcon: {
      fontSize: 80,
      color: theme.palette.primary.light,
      [theme.breakpoints.up('md')]: {
        fontSize: 100,
      },
    },
  }
}
