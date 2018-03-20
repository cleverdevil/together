export const setUserOption = (key, value, feathers = true) => {
  return {
    type: 'SET_USER_OPTION',
    key: key,
    value: value,
    feathers: feathers,
  };
};

export const logout = () => {
  return {
    type: 'LOGOUT',
  };
};
