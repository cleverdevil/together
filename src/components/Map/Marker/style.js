const markerSize = 24
export { markerSize }
export default {
  marker: {
    position: 'absolute',
    width: markerSize,
    height: markerSize,
    marginTop: 0 - markerSize / 2,
    marginLeft: 0 - markerSize / 2,
    fontSize: markerSize - markerSize / 2,
    pointer: 'cursor',
    transition: 'transform .2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  popover: {
    padding: '13px 20px',
  },
}
