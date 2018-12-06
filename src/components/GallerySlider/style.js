export default theme => ({
  loadMore: {
    width: '100%',
    marginTop: 16,
  },
  carousel: {},
  popup: {
    boxSizing: 'border-box',
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#111',
  },
  popupImage: {
    display: 'block',
    margin: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    boxShadow: '0 0 3em rgba(0,0,0,.5)',
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
