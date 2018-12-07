export default {
  CHANNEL_LIST: {
    NEXT: ['j', 'down', 'space'],
    PREVIOUS: ['k', 'up'],
    SELECT_CHANNEL: ['l', 'enter', 'right'],
  },
  TIMELINE: {
    NEXT: ['j', 'down', 'space'],
    PREVIOUS: ['k', 'up'],
    SELECT_POST: ['l', 'enter', 'right', 'v'],
    FOCUS_CHANNEL_LIST: ['h', 'left'],
    MARK_READ: 'm',
  },
  POST: {
    SCROLL_DOWN: 'j',
    SCROLL_UP: 'k',
    TO_TIMELINE: 'h',
    NEXT: 'space',
    OPEN: 'v',
    TOGGLE_READ: 'm',
  },
  GLOBAL: {
    KONAMI: 'up up down down left right left right b a',
    CHANNEL_1: ['ctrl+1', 'meta+1', 'alt+1'],
    CHANNEL_2: ['ctrl+2', 'meta+2', 'alt+2'],
    CHANNEL_3: ['ctrl+3', 'meta+3', 'alt+3'],
    CHANNEL_4: ['ctrl+4', 'meta+4', 'alt+4'],
    CHANNEL_5: ['ctrl+5', 'meta+5', 'alt+5'],
    CHANNEL_6: ['ctrl+6', 'meta+6', 'alt+6'],
    CHANNEL_7: ['ctrl+7', 'meta+7', 'alt+7'],
    CHANNEL_8: ['ctrl+8', 'meta+8', 'alt+8'],
    CHANNEL_9: ['ctrl+9', 'meta+9', 'alt+9'],
    NEW_POST: ['ctrl+n', 'meta+n', 'alt+n'],
    FOCUS_CHANNEL_LIST: ['c'],
    HELP: '?',
  },
}

/**
 * TODO: Focus channel list or timeline on load
 * TODO: Classic view needs to mark stuff as read
 * TODO: Global keymapping for:
 * Open notifications
 * Mark channel read
 * Jump to channel list
 * Jump to timeline
 * TODO: Gallery view controls
 * TODO: Timeline view contols
 * TODO: Map view controls
 * TODO: Shortcuts help view to show what all the shortcuts do
 */
