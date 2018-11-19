export default theme => ({
  dialogPaper: {
    display: 'block',
  },
  wrapper: {
    position: 'relative',
    width: '50em',
    maxWidth: '100%',
    paddingTop: 50,
  },
  appBar: {
    display: 'block',
    top: 0,
    left: 0,
    right: 0,
    position: 'fixed',
  },
  title: {
    flex: 1,
    fontWeight: 'normal',
  },
  content: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-between',
      '& > *': {
        width: '48%',
      },
    },
  },
})
