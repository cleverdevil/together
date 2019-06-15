import { darken } from '@material-ui/core/styles/colorManipulator'

export default theme => ({
  replyContext: {
    background:
      theme.palette.type === 'dark'
        ? darken(theme.palette.background.paper, 0.2)
        : darken(theme.palette.background.paper, 0.07),
  },
  replyUrl: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  icon: {
    marginRight: 10,
    marginBottom: -5,
    width: 18,
    height: 18,
  },
})
