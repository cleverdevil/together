export default theme => ({
  content: {
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
    '& blockquote': {
      borderLeft: '4px solid ' + theme.palette.primary.main,
      paddingLeft: theme.spacing.unit * 2,
      marginLeft: theme.spacing.unit * 2,
      '& blockquote': {
        marginLeft: theme.spacing.unit,
      },
    },
    // Emoji images'
    '& img[src^="https://s.w.org/images/core/emoji"]': {
      width: '1em',
    },
  },
  divider: {
    marginBottom: theme.spacing.unit,
  },
})
