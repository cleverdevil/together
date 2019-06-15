import { darken } from '@material-ui/core/styles/colorManipulator'

export default theme => {
  const dark = theme.palette.type === 'dark'
  const highlight = theme.palette.primary.main
  const background = darken(theme.palette.background.default, dark ? 0.5 : 0.1)

  return {
    drawer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      background,
      borderRight: '1px solid ' + theme.palette.divider,
      '&:focus, &.is-focused': {
        boxShadow: `0 0 4px inset ${highlight}`,
      },
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
    focused: {
      color: theme.palette.text.primary,
    },
    highlightedButton: {
      display: 'block',
      textAlign: 'left',
      textDecoration: 'none',
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
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
      minWidth: '2em',
      background: dark
        ? theme.palette.primary.dark
        : theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      fontWeight: 'bold',
      fontSize: '0.6em',
      textAlign: 'center',
      lineHeight: 1,
      padding: '.5em',
      borderRadius: '1em',
    },
  }
}
