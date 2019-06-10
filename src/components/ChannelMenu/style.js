export default theme => ({
  drawer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    background:
      theme.palette.type === 'dark'
        ? theme.palette.primary.dark
        : theme.palette.action.hover,
    borderRight: '1px solid ' + theme.palette.divider,
  },
  channelTextRoot: {
    padding: 0,
    color: 'inherit',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  button: {
    display: 'block',
    textAlign: 'left',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textDecoration: 'none',
  },
  highlightedButton: {
    display: 'block',
    textAlign: 'left',
    textDecoration: 'none',
    color: theme.palette.primary.contrastText,
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.secondary.main
        : theme.palette.primary.main,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  focused: {
    color: theme.palette.text.primary,
  },
  addButton: {
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  addForm: {
    borderTop: '1px solid ' + theme.palette.divider,
    padding: theme.spacing.unit,
    paddingBottom: 0,
  },
  unread: {
    position: 'absolute',
    top: '50%',
    right: 8,
    marginTop: '-1em',
    minWidth: '1em',
    background:
      theme.palette.type === 'dark'
        ? theme.palette.secondary.dark
        : theme.palette.primary.light,
    color: theme.palette.secondary.contrastText,
    fontWeight: 'bold',
    fontSize: '0.6em',
    textAlign: 'center',
    lineHeight: 1,
    padding: '.5em',
    borderRadius: '1em',
  },
})
