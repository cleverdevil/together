export default theme => ({
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    right: 0,
    bottom: 0,
    padding: 10,
    maxWidth: 'calc(100vw - 90px)',
    maxHeight: '100vh',
    zIndex: 2,
  },
  fabButton: {
    width: 56,
    height: 56,
  },
  fabProgress: {
    position: 'absolute',
    bottom: 10 - 1,
    right: 10 - 1,
    pointerEvents: 'none',
  },
})
