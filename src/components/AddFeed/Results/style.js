export default theme => ({
  results: {
    width: 320,
    maxWidth: '100%',
    marginTop: 10,
    marginBottom: 10,
    maxHeight: 'calc(100vh - 240px)',
    overflow: 'auto',
  },
  fixedCardActions: {
    background: theme.palette.background.paper,
    borderTop: '1px solid ' + theme.palette.text.disabled,
    position: 'sticky',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 9999, // To appear on top of maps
  },
})
