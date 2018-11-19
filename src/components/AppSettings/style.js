export default theme => ({
  fieldset: {
    width: '100%',
    maxWidth: '24em',
  },
  divider: {
    marginTop: 24,
    marginBottom: 24,
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    '&:hover button': {
      color: theme.palette.primary['900'],
    },
  },
})
