export const selectPostKind = postKindId => {
  return {
    type: 'SELECT_POST_KIND',
    postKindId: postKindId,
  };
};
