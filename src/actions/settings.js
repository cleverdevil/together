export const setSetting = (key, value) => {
  return {
    type: 'SET_SETTING',
    key: key,
    value: value,
  };
};
