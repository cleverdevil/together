export default theme => ({
  list: {
    position: 'relative',
    height: '100%',
  },
  fieldset: {
    display: 'block',
    maxWidth: '100%',
  },
  following: {
    display: 'block',
    width: '100%',
  },
  followingUrl: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  delete: {
    color:
      theme.palette.type === 'dark'
        ? theme.palette.error.light
        : theme.palette.error.dark,
    borderColor:
      theme.palette.type === 'dark'
        ? theme.palette.error.light
        : theme.palette.error.dark,
  },
})
