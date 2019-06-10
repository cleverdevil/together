export default theme => ({
  dialogPaper: {
    overflow: 'hidden',
  },
  wrapper: {
    position: 'relative',
    width: '50em',
    maxWidth: '100%',
    overflow: 'auto',
  },
  title: {
    flex: 1,
    fontWeight: 'normal',
  },
  singleColumn: {
    display: 'block',
  },
  twoColumns: {
    // [theme.breakpoints.up('sm')]: {
    //   display: 'flex',
    //   flexWrap: 'wrap',
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    //   '& > *': {
    //     width: '48%',
    //   },
    // },
  },
})
