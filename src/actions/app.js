export const toggleChannelsMenu = () => ({
  type: 'TOGGLE_CHANNELS_MENU',
})

export const toggleTheme = () => ({
  type: 'TOGGLE_THEME',
})

export const focusComponent = component => ({
  type: 'SET_FOCUSED_COMPONENT',
  component,
})

export const toggleShortcutHelp = () => ({
  type: 'TOGGLE_SHORTCUT_HELP',
})
