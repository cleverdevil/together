export const setUserOption = (key, value) => {
  return {
    type: 'SET_USER_OPTION',
    key: key,
    value: value,
  };
}

export const logout = () => {
  return {
    type: 'LOGOUT',
  }
}