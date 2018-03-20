export const setSetting = (key, value, feathers = true) => {
  return {
    type: 'SET_SETTING',
    key: key,
    value: value,
    feathers: feathers,
  };
};
