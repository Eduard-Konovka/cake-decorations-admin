const actions = {
  updateUserProfile: (state, payload) => {
    const updatedState = { ...state };
    updatedState.auth.userId = payload.userId;
    updatedState.auth.name = payload.name;
    return updatedState;
  },
};

export const { updateUserProfile } = actions;
