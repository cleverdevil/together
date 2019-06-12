export default theme => ({
  shortcuts: {
    boxSizing: 'border-box',
    position: 'relative',
    '&:focus, &.is-focused': {
      boxShadow: `0 0 4px inset ${
        theme.palette.type === 'dark'
          ? theme.palette.secondary.main
          : theme.palette.primary.main
      }`,
    },
    // '&:focus::after, &.is-focused::after': {
    //   content: '""',
    //   display: 'block',
    //   pointerEvents: 'none',
    //   position: 'absolute',
    //   top: 0,
    //   bottom: 0,
    //   left: 0,
    //   right: 0,
    //   border: `2px solid ${
    //     theme.palette.type === 'dark'
    //       ? theme.palette.secondary.main
    //       : theme.palette.primary.main
    //   }`,
    // },
  },
  noPosts: {
    padding: theme.spacing.unit * 2,
  },
  loading: {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 9999,
  },
})
