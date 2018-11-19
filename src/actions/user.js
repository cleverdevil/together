export const setUserOption = (key, value, feathers = true) => ({
  type: 'SET_USER_OPTION',
  key: key,
  value: value,
  feathers: feathers,
})

export const logout = () => ({
  type: 'LOGOUT',
})
