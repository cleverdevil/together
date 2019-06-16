export default theme => ({
  loadMore: {
    width: '100%',
    marginTop: 16,
  },
  carousel: {},
  popup: {
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#111',
  },
  popupMedia: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  button: {
    color: 'white',
    background: 'rgba(0,0,0,.4)',
  },
  drawer: {
    display: 'block',
    boxSizing: 'border-box',
    width: 300,
    maxWidth: '80%',
    maxHeight: '100%',
    overflow: 'auto',
  },
})
