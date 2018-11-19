export const setSetting = (key, value, feathers = true) => ({
  type: 'SET_SETTING',
  key: key,
  value: value,
  feathers: feathers,
})
